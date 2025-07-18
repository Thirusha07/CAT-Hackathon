import torch
import cv2
import numpy as np

# Load pretrained YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Constants
KNOWN_HEIGHTS = {
    'person': 1.7,   # meters
    'car': 1.5,
    'truck': 3.0
}
FOCAL_LENGTH = 615  # estimated focal length in pixels (calibration needed for accuracy)

def estimate_distance(real_height, pixel_height):
    # Ensure pixel_height is not zero to avoid division errors
    if pixel_height == 0:
        return float('inf')
    return (real_height * FOCAL_LENGTH) / pixel_height

def run_proximity_detection():
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Run YOLO detection
        results = model(frame)

        # Extract detections
        for *xyxy, conf, cls in results.xyxy[0]:
            x1, y1, x2, y2 = map(int, xyxy)
            label = model.names[int(cls)]

            if label in KNOWN_HEIGHTS:
                pixel_height = y2 - y1
                real_height = KNOWN_HEIGHTS[label]
                distance = estimate_distance(real_height, pixel_height)

                # --- MODIFIED LOGIC START ---

                # Determine color based on the object's distance
                if distance <= 5:
                    color = (0, 0, 255)      # Red for 5m or less
                elif distance <= 10:
                    color = (0, 165, 255)    # Orange for 10m or less
                elif distance <= 20:
                    color = (0, 255, 255)    # Yellow for 20m or less
                else:
                    color = (0, 255, 0)      # Green for objects farther than 20m

                # Draw the bounding box using the determined color
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

                # Prepare the text to display
                display_text = f'{label} ~{distance:.1f}m'

                # Draw the text above the bounding box using the determined color
                cv2.putText(frame, display_text, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

                # --- MODIFIED LOGIC END ---

        cv2.imshow("Proximity Detector", frame)

        if cv2.waitKey(1) & 0xFF == 27:  # Press ESC to quit
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_proximity_detection()
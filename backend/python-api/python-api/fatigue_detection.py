import cv2
import time

# Load Haarcascade classifiers
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')


def detect_face_and_eyes(gray, frame_width, faces):
    eyes_detected = False
    face_centered = False

    for (x, y, w, h) in faces:
        face_cx = x + w // 2
        if frame_width * 0.3 < face_cx < frame_width * 0.7:
            face_centered = True

        roi_gray = gray[y:y + h, x:x + w]
        eyes = eye_cascade.detectMultiScale(roi_gray)

        if len(eyes) > 0:
            eyes_detected = True

    return eyes_detected, face_centered


def is_driver_fatigued(duration=10):
    cap = cv2.VideoCapture(0)
    start_time = time.time()

    eye_closed_frames = 0
    face_away_frames = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame_height, frame_width = frame.shape[:2]
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        eyes_detected, face_centered = detect_face_and_eyes(gray, frame_width, faces)

        eye_closed_frames = eye_closed_frames + 1 if not eyes_detected else 0
        face_away_frames = face_away_frames + 1 if not face_centered else 0

        if time.time() - start_time > duration:
            break

    cap.release()

    return eye_closed_frames > 20 or face_away_frames > 20

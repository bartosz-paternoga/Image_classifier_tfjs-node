from keras.models import model_from_json
from keras.models import load_model
import cv2
import numpy as np
import tensorflowjs as tfjs


model = load_model('model.h5')
print("Loaded model from disk")

model.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['accuracy'])

img = cv2.imread("./predict/3.jpg")
img = cv2.resize(img, (150,150))
print(img.shape)
img = img.reshape(1, 150, 150, 3)

print(img.shape)
#print(np.argmax(loaded_model.predict(img)))
print(model.predict(img)) 


import random
from PIL import Image, ImageOps
import numpy as np

img = Image.open('./2.jpg')

cropX = random.randint(0,img.width-310)
cropY = random.randint(0,img.height-210)

cropped = img.crop((cropX,cropY,cropX+300,cropY+200)) 

array=np.array(cropped)
rows=len(array)
cols=len(array[0])

slideX = random.randint(80,cols - 60)
slideY = random.randint(0, rows- 60)

# slideX = 120
# slideY = 59
# print(slideX,slideY)

print([slideX,slideY])

slide = cropped.crop((slideX,slideY,slideX+48,slideY+48))
slide = ImageOps.expand(slide, border=1, fill='#6F686E')
# slide.show()

for col in  range (slideX,slideX+48):
    for row in range (slideY,slideY+48):
        for i in range(0,3):
            if(array[row,col][i] - 60 >0):
                array[row,col][i] = array[row,col][i] - 60
            else:
                array[row,col][i] = 0

cropped =  Image.fromarray(array)
# cropped.show()

slide.save('slide.jpg')
cropped.save('cropped.jpg')
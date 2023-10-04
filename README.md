# Aberoth-Computer-Vision

# Aberoth-Computer-Vision

This was a fun experiment where I created a module for my [Custom Aberoth Gameclient](https://github.com/thomasriley0/Custom-Aberoth-GameClient). I experimented with computer vision using the library [opencv.js](https://docs.opencv.org/) which is an open-source library supporting computer vision usecases like template matching and pixel masking on an image. 

The file imageDetection.js is a module that can be added to the [Modded Game Client](https://github.com/thomasriley0/Custom-Aberoth-GameClient) I created for aberoth. The module works by continously grabbing the updated canvas content from the game client and then creating a Mat object using the Opencv.js library. The Mat class is an n dimensional array used to store the values of an image so that we can later process it. With the Mat object containing the current game client's canvas content, we can use template matching to find the location of our player relative to the region the game that our player is in. In order to efficiently template match given the image's size, we reduce the size by cropping a smaller rectangle & masking out any unwanted pixels that will skew the template matching. We also utilize a opencv function to convert our image to black and white to save on processing time and adding edge detection to detect the edges of the cave. Using edge detection greatly increases the overall sucess of template matching. After template matching the edited picture of our current game client, it will return an object a tuple of x and y locations and a confidence percentage. 

A visual is added below to demonstrate how the edge detection and masking works:

Current Picture of Game Client:

<img width="640" alt="Screenshot 2023-10-03 at 6 47 37 PM" src="https://github.com/thomasriley0/Aberoth-Computer-Vision/assets/129229020/59763380-af93-4733-9792-4268ed39a613">

Picture after edge detection and pixel masking:

<img width="595" alt="Screen Shot 2022-12-12 at 12 56 42 AM" src="https://github.com/thomasriley0/Aberoth-Computer-Vision/assets/129229020/303c223d-4ac5-4439-9e70-2090dff4b9fa">

By utilizing edge detection and pixel matching, we can confidently match the edges of the cave with the edges of the cave with the overall map of the entire region to find the subregion of the map that we are in.
A visual is added below to demonstrate how the module works:

https://github.com/thomasriley0/Aberoth-Computer-Vision/assets/129229020/2699d2fc-e2ee-468f-b5d6-864bc365f30d

As you can see above, we use the picture of the current game and match it with a map of the current region in the game we are in. By using template matching with the help of pixel masking we can confidently deduce the current location of the player relative to the region.


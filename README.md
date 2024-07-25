# opencv_js_sample

## Contents
All the follow projects used [vite](https://vitejs.dev/), so please install with `npm` if you would like to download and use these projects. 

### Import and build
- Build infomation of opencv.js - 0101buildinfo/<br>
  (note) no check `npm run build` only `npm run dev`.
- The list of functions in opencv.js - 0102functions/<br>
   (note) no check `npm run build` only `npm run dev`.
- The list of consts of opencv.js - 0103consts/<br>
   (note) no check `npm run build` only `npm run dev`.

### Image
- Examing the structure of an image - 0201metadata/<br>
  (note) no check `npm run build` only `npm run dev`.
- Copy canvas - 0202copycanvas/<br>
  (note) no check `npm run build` only `npm run dev`.
- Pick pixel color - 0203pickpixelcolor/<br>
  (note) no check `npm run build` only `npm run dev`.
- Draw a circle in monochrome - 0204drawcircle/<br>
   (note) no check `npm run build` only `npm run dev`.
- Draw a circle with floating point numbers - 0205drawcircle32/<br>
   (note) no check `npm run build` only `npm run dev`.
- Draw Tool - 0206drawtool/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/paint/) (note)PC only
- Region of Interest - 0207roi/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/roi/)

### Video processing
- Composite video frames and images - 0301addimage/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/videoadd/)
- Camera Flip - 0302cameraflip/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/videoflip/)
- Video Miniture - 0303miniture/
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/miniture/)
- Video Transitions - 0304transition/
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/transition/)
- Video Mog2 - 0305mog2/
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/mog2/)
- Video Opticalflow - 0306opticalflow/
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/opticalflow/)

### Image processing
- Image Resize / Mosaic / All - 0401imageresize/<br>
  - (note) no check `npm run build` only `npm run dev`.
- Image Resize / Mosaic / A part - 0402imageresize2/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/imageresize2/)
- Image Blur - 0403imageblur/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/blur/)
- Image Resize / Mosaic / A part - 0404imageedge/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/edge/)
- Image Resize / Mosaic / A part - 0405imageedgeanime/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/edgeAnime/)
- Detect QR Code - 0406qr/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/qr/)
- Erase Powerlines - 0407morph/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/morph/)
- Tilt correct - 0408hough/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/hough/)
- Detect Faces - 0409face/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/face/)
- Compose Images - 0410compose/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/compose/)

### Color
- Monochrome color - 0501grayscale/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/grayscale/)
- Color Invert - 0502invert/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/invert/)
- Sepia Color - 0503sepia/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/sepia/)
- Analyze RGB color - 0504rgb/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/rgb/)

- Color Hue - 0507hue/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/hue/)
- Color Posterize - 0509poster/<br>
  - `npm run build` is available.<br>
  - [Try on is here](https://edison-garden.tokyo/opencv/poster/)

## Download and Install
- OpenCV.js Library download
  * move to the [link](https://docs.opencv.org/). 
  * download latest version in the page.
  * Extract the zip file you downloaded.
  * Copy `opencv.js` file in the folder you extract and paste to your work directory.
  + {note} The `opencv.js` file is not ES Module compatible. You need to customize it a bit to make it ES Module compatible. `opencv.js` file in this repository is already ES Module compatible.

## Build
- develop / localserver
```
npm run dev
```

- production build
```
npm run build
```
After build, upload all files in the `dist` directory to your host server with FTP and so on.

## Functions
[Reference page](https://docs.opencv.org/4.10.0/d2/d75/namespacecv.html#af6df65b17fb11af6d34634b6dfa44683)

## Reference

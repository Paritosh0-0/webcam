import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { jsPDF } from 'jspdf';

const CustomWebcam = ({ getImage }) => {
  const [mirrored, setMirrored] = useState(false);
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [images, setImages] = useState([]);

  const retake = () => {
    setImgSrc(null);
  };

  // const fetchImages = useCallback(async () => {
  //   try {
  //     const response = await fetch("/images");
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch images.");
  //     }

  //     const data = await response.json();
  //     console.log("Fetched images:", data); // Add this log
  //     setImages(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    getImage(imageSrc);

    try {
      // const response = await fetch("/upload", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ image: imageSrc }),
      // });

      // if (!response.ok) {
      //   throw new Error("Image upload failed.");
      // }

      console.log('Image uploaded successfully.');
      // Refresh the image list after uploading a new image
      // fetchImages();
    } catch (error) {
      console.error(error);
      // Handle error if the image upload fails.
    }
  }, [webcamRef]);

  // useEffect(() => {
  //   // Use an async function to call the fetchImages function
  //   const fetchData = async () => {
  //     await fetchImages();
  //   };

  //   fetchData();
  // }, [fetchImages]);


  // Function to save the image as a PDF
  const saveImageAsPDF = () => {
    if (imgSrc) {
      // Create a new jsPDF instance
      const pdf = new jsPDF();

      // Load the image to the PDF
      const imgData = imgSrc;
      pdf.addImage(imgData, 'JPEG', 10, 10, 100, 100); // Adjust the position and dimensions as needed

      // Save the PDF with a custom name
      pdf.save(`webcam_image_${Date.now()}.pdf`);
    }
  };

  return (
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam
          mirrored={mirrored}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.8}
          audio={false} // Set to false to disable webcam audio
          ref={webcamRef}
          style={{ width: '100%', height: 'auto' }}
        />
      )}
      <div className="controls">
        <div>
          <input
            type="checkbox"
            checked={mirrored}
            onChange={e => setMirrored(e.target.checked)}
          />
          <label>Mirror</label>
        </div>
      </div>

      <div className="btn-container">
        {imgSrc ? (
          <>
            <button onClick={retake}>Retake Photo</button>
          </>
        ) : (
          <button onClick={capture}>Capture Photo</button>
        )}
      </div>

      <div className="image-list">
        {images.map(image => (
          <div key={image.id}>
            <img src={image.image_path} alt={`Image ${image.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomWebcam;

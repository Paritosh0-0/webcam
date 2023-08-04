// import html2pdf from 'html2pdf.js';
import React, { useRef, useState } from 'react';
import CustomWebcam from './CustomWebcam';
import jsPDF from 'jspdf';
import axios from 'axios';

const Dashboard = () => {
  const [passNoConfirmed, setPassNoConfirmed] = useState(false);
  const [passNumber, setPassNumber] = useState('');
  const [selectedType, setSelectedType] = useState('Visitor Entry');
  const [visitorType, setVisitorType] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorID, setVisitorID] = useState('');
  const [invitedBy, setInvitedBy] = useState('John Doe');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialID, setMaterialID] = useState('');
  const [materialOrderedBy, setMaterialOrderedBy] = useState('');
  const [image, setImage] = useState(null);
  const printableRef = useRef();


  const getImage = image => {
    setImage(image);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };

  const invitedByOptions = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Williams',
    'Michael Brown',
    'Emily Davis',
    'David Jones',
    'Sophia Wilson',
    'James Miller',
    'Olivia Taylor',
  ];

  const materialOrderedByOptions = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Williams',
    'Michael Brown',
    'Emily Davis',
    'David Jones',
    'Sophia Wilson',
    'James Miller',
    'Olivia Taylor',
  ];

  const handleTypeChange = event => {
    setSelectedType(event.target.value);
  };

  let data = {};

  const [pdfGenerated, setPdfGenerated] = useState(false);

  const handleSaveDetails = () => {
    if (pdfGenerated) {
      return;
    }

    if (image === null) {
      window.alert('Image is needed for generating the PDF');
      return;
    }
    generatePDF();

    setPdfGenerated(true);
  };

  const generatePDF = () => {

    if(pdfGenerated){
      return;
    }

    setPdfGenerated(true);

    // Create a new jsPDF instance
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    });

    // Set the default font size and style
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Add the data to the PDF
    pdf.text(15, 15, 'Date: ' + getCurrentDate());
    pdf.text(
      15,
      22,
      'Pass No: ' + (passNoConfirmed ? `Confirmed - ${passNumber}` : '')
    );

    const startY = 40;
    const tableX = 15;
    const cellWidth = 50;
    const cellHeight = 10;
    const lineHeight = 10;
    const tableData = [
      ['Type', selectedType],
      selectedType === 'Visitor Entry' && ['Visitor Type', visitorType],
      selectedType === 'Visitor Entry' && ['Visitor Name', visitorName],
      selectedType === 'Visitor Entry' && ['Visitor ID', visitorID],
      selectedType === 'Visitor Entry' && ['Invited By', invitedBy],
      selectedType === 'Material Entry' && [
        'Material Description',
        materialDescription,
      ],
      selectedType === 'Material Entry' && ['Material ID', materialID],
      selectedType === 'Material Entry' && [
        'Material Ordered By',
        materialOrderedBy,
      ],
    ].filter(Boolean);

    const drawCell = (x, y, text) => {
      pdf.rect(x, y, cellWidth, cellHeight, 'S');
      pdf.text(x + 2, y + 7, text); // Adding 2 to x to leave some space from the border
    };

    let currentY = startY;
    for (const [header, value] of tableData) {
      drawCell(tableX, currentY, header);
      drawCell(tableX + cellWidth, currentY, value);
      currentY += lineHeight;
    }

    // Add the image to the PDF NEXT TO TABLE
    pdf.addImage(image, 'JPEG', 120, 40, 70, 55);

    // Save the PDF
    pdf.save('gate_pass.pdf');

    generatePDF();

    axios.post('http://192.168.0.178:8000/api/upload/', data)
    .then(response => {
      console.log('Data saved on the backend:', response.data);
      // You can perform any additional actions here after the backend call, if needed
    })
    .catch(error => {
      console.error('Error saving data on the backend:', error);
      // Handle the error as per your application's requirements
    });

  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold my-12">Dashboard</h1>
      <div className="flex items-center justify-center gap-3">
        <div className="w-1/2" ref={printableRef}>
          <div className="mb-4 flex items-center justify-start">
            <label className="block font-bold w-24 text-left">Date</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-400 rounded placeholder-gray-400 ml-3"
              value={getCurrentDate()}
              readOnly
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-32 text-left">Pass No</label>
            <input
              type="text"
              className="w-40 p-2 border border-gray-400 rounded placeholder-gray-400 ml-3"
              onChange={e => setPassNumber(e.target.value)}
            />
            <div className="flex">
              <input
                className="ml-3"
                type="checkbox"
                checked={passNoConfirmed}
                onChange={() => setPassNoConfirmed(!passNoConfirmed)}
              />
              <label className="ml-2 align">Confirm</label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold">Type</label>
            <select
              className="w-full p-2 border border-gray-400 rounded"
              onChange={handleTypeChange}
              value={selectedType}
            >
              <option value="Visitor Entry">Visitor Entry</option>
              <option value="Visitor Exit">Visitor Exit</option>
              <option value="Material Entry">Material Entry</option>
              <option value="Material Exit">Material Exit</option>
            </select>
          </div>
          {selectedType === 'Visitor Entry' && (
            <>
              <div className="mb-4">
                <label className="block font-bold">Visitor Type</label>
                <select
                  className="w-full p-2 border border-gray-400 rounded"
                  value={visitorType} // Set the value attribute to visitorType
                  onChange={e => setVisitorType(e.target.value)}
                >
                  <option>Invited Visitor</option>
                  <option>Walk-in Visitor</option>
                  <option>Government Official</option>
                  <option>VIP Visitor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-bold">Visitor Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-400 rounded placeholder-gray-400"
                  onChange={e => setVisitorName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold">Visitor ID</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-400 rounded placeholder-gray-400"
                  onChange={e => setVisitorID(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold">Invited By</label>
                <select
                  className="w-full p-2 border border-gray-400 rounded"
                  value={invitedBy} // Set the value attribute to invitedBy
                  onChange={e => setInvitedBy(e.target.value)}
                >
                  {invitedByOptions.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {selectedType === 'Material Entry' && (
            <>
              <div className="mb-4">
                <label className="block font-bold">Material Description</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-400 rounded placeholder-gray-400"
                  onChange={e => setMaterialDescription(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold">Material ID</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-400 rounded placeholder-gray-400"
                  onChange={e => setMaterialID(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold">Material Ordered By</label>
                <select
                  className="w-full p-2 border border-gray-400 rounded"
                  onChange={e => setMaterialOrderedBy(e.target.value)}
                  value={materialOrderedBy}
                >
                  {materialOrderedByOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {selectedType === 'Material Exit' && (
            <>
              <div className="mb-4">
                <label className="block font-bold">Material Description</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-400 rounded placeholder-gray-400"
                  onChange={e => materialDescription(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold">Material ID</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-400 rounded placeholder-gray-400"
                  onChange={e => setMaterialID(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold">Material Ordered By</label>
                <select
                  className="w-full p-2 border border-gray-400 rounded"
                  onSelect={val => setMaterialOrderedBy(val)}
                >
                  {materialOrderedByOptions.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSaveDetails}
            disabled={pdfGenerated} //Diable the button when the PDF is generated
          >
            Save Details & Print Receipt
          </button>
        </div>
        <div className="w-1/2 px-4">
          <CustomWebcam getImage={getImage} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

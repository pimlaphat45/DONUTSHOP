import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function Dough({ formData, setFormData, nextStep, prevStep }) {
  const [sprinkleOptions, setSprinkleOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8082/customdonuts")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          const sprinkleData = data.products.filter(
            (option) => option.OptionType === "Sprinkles"
          );
          setSprinkleOptions(sprinkleData);
        } else {
          console.error("Error: Data is not in expected format:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChange = (e) => {
    const selectedOption = sprinkleOptions.find(
      (option) => option.OptionName === e.target.value
    );
    const updatedFormData = {
      ...formData,
      sprinklesID: selectedOption ? selectedOption.OptionID : "",
      sprinklesName: selectedOption ? selectedOption.OptionName : "", // อัปเดต sprinklesName
      sprinklesPrice: selectedOption ? selectedOption.Price : 0, // Update flavorPrice
      itemPrice: selectedOption ? selectedOption.Price : 0, // Set itemPrice to flavor price
    };
    setFormData(updatedFormData);
    console.log("FormData after setFormData:", updatedFormData);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-3xl text-pink-500 font-bold mb-2">เลือกซอสโดนัท</h2>
      <p className="text-sm text-gray-500 mb-6">CHOOSE DONUT FLAVOR</p>
      <div className="flex flex-col md:flex-row items-start bg-white w-full p-6 rounded-lg shadow-inner">
      <div className="flex flex-col md:w-1/2 mt-10">
          {sprinkleOptions.map((option) => (
            <label
              key={option.OptionID}
              className="flex items-center mb-4 text-2xl font-bold text-black"
            >
              <input
                type="radio"
                name="topping"
                value={option.OptionName}
                checked={formData.sprinklesID === option.OptionID}
                onChange={handleChange}
                className="mr-2"
              />
              {option.OptionName} - {option.Price} บาท
            </label>
          ))}
        </div>
        <div className="flex justify-center md:w-1/2 mt-4 md:mt-0">
          <img
            src="/src/img/donut0.png"
            alt="Donut Stack"
            className="w-full h-72 object-contain"
          />
        </div>
      </div>
      <div className="flex justify-between w-full mt-6">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 focus:outline-none"
        >
          ย้อนกลับ
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 focus:outline-none"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

Dough.propTypes = {
  formData: PropTypes.shape({
    sprinkleID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    itemPrice: PropTypes.number.isRequired, // เพิ่ม itemPrice
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
};
import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState('/');
  let inputRef = useRef(null);
  const [loading,setLoading]=useState(false);

  const imageGenerator = async () => {
    if (inputRef.current.value === '') {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.openai.com/v1/images/generations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer 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',
            'User-Agent': 'Chrome',
          },
          body: JSON.stringify({
            prompt: `${inputRef.current.value}`,
            n: 1,
            size: '512x512',
          }),
        }
      );

      if (response.ok) {
        let data = await response.json();
        let data_array = data.data;

        if (data_array && data_array.length > 0) {
          setImage_url(data_array[0].url);
          setLoading(false);
        } else {
          console.error('No data or empty data array');
          console.error('API Response:', data);
        }
      } else {
        console.error(`API request failed with status: ${response.status}`);
        console.error(await response.text());
      }
    } catch (error) {
      console.error('An error occurred during the API request:', error);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        Ai image <span>generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url === '/' ? default_image : image_url} alt="" />
          <div className="loading">
            <div className={loading?"loading-bar-full":"loading-bar"}></div>
            <div className={loading?"loading-text":"display-none"}>Loading....</div>
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe What You Want To See"
        />
        <div className="generate-btn" onClick={() => imageGenerator()}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;

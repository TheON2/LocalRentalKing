import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

const SearchLocation = () => {
  const [address, setAddress] = useState("");
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    setAddress(fullAddress) // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  }

  return (
    <>
      <DaumPostcode
        onComplete={handleComplete}
        adress ={address}/>
      <h2>{address}</h2>
    </>
  );

}
export default SearchLocation;
import React, {useState} from 'react';
import { useForm } from "react-hook-form";
import { BOOKING_BASE } from '../constants/backendConstants';
import {convert, options, options1} from "../utils/xmlUtils";

function App() {
        
  const [serverOutputMessage, setServerOutputMessage] = useState("Kek");

  const { register: registerCopy, handleSubmit: handleSubmitCopy } = useForm();
  const { register: registerCancel, handleSubmit: handleSubmitCancel } = useForm();

  const onSubmitCopy = data => {
      const url = BOOKING_BASE + 'sell/vip/' + data.ticketId + '/' + data.personId;
      fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/xml; charset=utf-8'
          }
      }).then(response => {
          return response.text();
      }).then (response => {
          console.log(response);
          //const convert = require('xml-js');
          const result = convert.xml2js(response, options);
          setServerOutputMessage(result.BookingResponseDTO.message);
      });
  };

  const onSubmitCancel = data => {
    const url = BOOKING_BASE + 'person/' + data.personId + '/cancel';
    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/xml; charset=utf-8'
        }
    }).then(response => {
        return response.text();
    }).then (response => {
        console.log(response.message);
        //const convert = require('xml-js');
        const result = convert.xml2js(response, options);
        setServerOutputMessage(result.BookingResponseDTO.message);
    });
  };
  

  return (
    <div className="App">
        <form onSubmit={handleSubmitCopy(onSubmitCopy)}>
            <p>скопировать указанный билет, создав такой же, но с категорией "VIP" и с удвоенной ценой</p>
            <p>
                <label>
                    TicketId:
                    <input type="number" {...registerCopy("ticketId", { required: true, min: 0, max: 1000 })} />
                </label>
            </p>
            <p>
                <label>
                    PersonId:
                    <input type="number" {...registerCopy("personId", { required: true, min: 0, max: 1000 })} />
                </label>
            </p>
        <input type="submit" />
        </form>

        <form onSubmit={handleSubmitCancel(onSubmitCancel)}>
            <p>отменить все букирования указанного человека, удалив его id изо всех билетов</p>
            <p>
                <label>
                    PersonId:
                    <input type="number" {...registerCancel("personId", { required: true, min: 0, max: 1000 })} />
                </label>
            </p>
            <input type="submit" />
        </form>

        <p onClick={() => setServerOutputMessage("")}>{serverOutputMessage && 
        <span>Server output: {serverOutputMessage}</span>
        }</p>
    </div>
  );
}

export default App;
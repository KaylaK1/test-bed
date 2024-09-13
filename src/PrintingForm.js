/**
 * This accept 1 to n orders and print out the combined
 * lumber order amount.
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import print from 'print-js'
import './printFormCSS.css';

const Order = [{
    "stairType": "Blue",
    "number": "90210",
    "name": "Bob",
    "material": "Verdana",
    "orderNumber": "wo995",
    "address": "NYC",
    "lumberOrder": {
      "2x12 PT Brown": {
        "96": 1,
        "32": 2
      },
      "plywood 5/8\" PT": {
        "48 x 48": 1
      },
      "2x4 PT Brown": {
        "96": 1
      }
    }
  }];

// React.memo stops checkbox clicks from calling a rerender.
export const PrintingForm = React.memo(( { workOrders } ) => {
  console.log("the work orders: ", workOrders);
  const [orderTotal, setOrderTotal] = useState(new Map());

  // Calculate the Order Total - only when workOrders changes
  useEffect(() => {
    // Use a new Map to clear old state
    const newOrderTotal = new Map();

    workOrders.forEach(order => {
      Object.entries(order.lumberOrder).forEach(([material, details]) => {
        Object.entries(details).forEach(([length, count]) => {
          if (newOrderTotal.has(material)) {
            const lengths = newOrderTotal.get(material);
            // Add or update the length and count
            lengths[length] = (lengths[length] || 0) + count; 
          } else {
            // The material doesn't exist - add it's length and count.
            newOrderTotal.set(material, { [length]: count });
          }
        });
      });
    });

    setOrderTotal(newOrderTotal);
    console.log("updated total: ",newOrderTotal);
  }, [workOrders]);
  

  return (
    <div id="printJS-form">
      {/* Header Section */}
      <div className="header">
        <h1>Sawback Craft Co</h1>
        <p>
          2850 107 Ave SE #102,<br />
          Calgary, AB T2Z 3Z4<br />
        </p>
      </div>
      <div className="order-info order-total">
          <h2 className="section-title">Order Total</h2>
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Length</th>
                  <th>Sum</th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.from(orderTotal).map(([material, lengths]) => (
                    <React.Fragment key={material}>
                      {
                        Object.entries(lengths).map(([length, count]) => (
                          <tr key={`${material}-${length}`}>
                            <td>{material}</td>
                            <td>{length}</td>
                            <td>{count}</td>
                          </tr>
                        ))
                      }
                    </React.Fragment>
                  ))
                }
              </tbody>
            </table>
          </div>
      {
        workOrders.map((order, index) => (
        <React.Fragment key={index}>
          <div className="client-info"  >
            <h2 className="section-title">Order</h2>
            <ul >
              <li><strong>Product: </strong>{order.stairType}</li>
              <li><strong>Address: </strong>{order.address}</li>
              <li><strong>Work Order: </strong>{order.orderNumber}</li>
              <li><strong>Date: </strong>09-01-2024</li>
            </ul>
          </div>
          <div className="order-info">
              <table>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Length</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Object.entries(order.lumberOrder).map(([material, details]) => (
                      Object.entries(details).map(([length, count], i) => (
                        <tr key={`${material}-${length}-${i}`}>
                          <td>{material}</td>
                          <td>{length}</td>
                          <td>{count}</td>
                        </tr>
                      ))
                    ))}
                </tbody>
              </table>
          </div>        
        </React.Fragment>    
      ))}
      {/* Print Button */}
      <button
        type="button"
        className="print-btn"
        onClick={() =>
          print({
            printable: "printJS-form",
            type: "html",
            css: [
              "/printFormCSS.css" // Ensure this file is in the public directory
            ],
            scanStyles: false
          })
        }
      >
        Print Form
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
    // Re-render only if workOrders actually changes
    return JSON.stringify(prevProps.workOrders) === JSON.stringify(nextProps.workOrders);
});
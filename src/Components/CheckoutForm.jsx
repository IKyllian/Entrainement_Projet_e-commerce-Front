import React, {Component} from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button } from 'reactstrap'

class CheckoutForm extends Component {
  
  render() {
    return (
      <div className="checkout">
        <h6 className='title-purchase'> Montant : 86 € </h6>
        <div style={{width: '40%'}}>
            <CardElement />
        </div>
        <Button className='button-purchase' color='info'>Paiment</Button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
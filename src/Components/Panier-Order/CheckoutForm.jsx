import React, {useState} from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button } from 'reactstrap'
import { Modal, Icon } from 'antd';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';


import {adressIp} from '../../config';

function CheckoutForm(props) {

  const [modal, setModal] = useState(false);


  //Permet de créer la commande en base de donnée
  var confirmOrder = () => {
    var datasBody = JSON.stringify({
      userToken: props.userToken,
      orderProducts : props.orderProducts,
      productsQuantity : props.productsQuantity,
      orderAddress : props.orderAddress,
      orderCity : props.orderCity,
      orderZipCode : props.orderZipCode,
      totalOrder : props.totalOrder
    })

    fetch(`http://${adressIp}:3000/orderConfirm`,
    {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache'
        },
        body: datasBody
    })
    .then(function(response) {
        return response.json();
    })
    .then(datas => {
        if(datas.result) {
          setModal1Visible(true);
          props.orderValidate();
          props.resetOrder();
        } else {
          setModal1Visible(false);
        }
    })
    .catch(function(err) {
        console.log(err);
    })
  }

  //Permet de rendre visible ou non la model de confirmation de commande
  var setModal1Visible = modal1Visible => {
    setModal(modal1Visible);
  }

  return (
    <div className="checkout">
      <h6 className='title-purchase'> Montant : {props.totalOrder} € </h6>
      <div style={{width: '40%'}}>
          <CardElement />
      </div>
      <Button className='button-purchase' color='info' onClick={() => confirmOrder()}>Paiment</Button>
      <Modal
        centered
        visible={modal}
        onOk={() => setModal(false)}
        okText='Retour sur le site'
        footer={
          <Link to='/'>
            <Button color='primary'> Retour sur le site </Button>
          </Link>
        }
      >
          <h5 className='text-center'> Votre commande a bien été créé ! </h5>
          <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{fontSize: '50px', marginLeft: '4.2em'}} />
        </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  console.log(state.Order)
  return {
    userToken : state.User.token,
    orderProducts : state.Order.products,
    productsQuantity : state.Order.productsQuantity,
    orderAddress : state.Order.address,
    orderCity : state.Order.city,
    orderZipCode : state.Order.zipCode,
    totalOrder : state.Order.totalOrder
  }
}

function mapDispatchToProps(dispatch) {
  return {
    orderValidate : function() {
      dispatch({
        type : 'resetPanier',
      })
    },
    resetOrder : function() {
      dispatch({
        type : 'resetOrder',
      })
    }
  }
}


export default connect(
  mapStateToProps, 
  mapDispatchToProps
) (injectStripe(CheckoutForm))
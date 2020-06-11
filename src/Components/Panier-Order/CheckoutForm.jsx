import React, { useState } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Modal, Result, Button, notification } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import {adressIp} from '../../config';

function CheckoutForm(props) {
  const [modal, setModal] = useState(false);

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Une erreur est survenue',
      description:
        `Un problème est survenue lors de la validation de votre commande, veuillez réesayer plus tard si cela persiste`,
    });
};
  //Permet de créer la commande en base de donnée
  var confirmOrder = async  () => {
    const {stripe} = props;
    //Création d'un token Stripe
    var token = await stripe.createToken();

    var datasBody = JSON.stringify({
      userToken: props.userToken,
      orderProducts : props.orderProducts,
      productsQuantity : props.productsQuantity,
      orderNameAddress : props.orderNameAddress,
      orderAddress : props.orderAddress,
      orderAdditionalAddress : props.orderAdditionalAddress,
      orderCity : props.orderCity,
      orderZipCode : props.orderZipCode,
      totalOrder : props.totalOrder,
      discountOrder : props.discountOrder,
      discountId: props.discountId,
      stripeToken: token
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
          props.orderValidate(datas.userPoints);
          props.resetOrder();
          props.deleteDiscountCoupon()
        } else {
          openNotificationWithIcon('error');
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
        footer={null}
      >
        <Result
          status="success"
          title="Votre commande a bien été validée !"
          extra={[
            <Link to='/'>
              <Button type="primary" key="console">
                Retour sur le site
              </Button>
            </Link>
          ]}
        />
        </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userToken : state.User.token,
    orderProducts : state.Order.products,
    productsQuantity : state.Order.productsQuantity,
    orderNameAddress : state.Order.name,
    orderAddress : state.Order.address,
    orderAdditionalAddress : state.Order.additionalAddress,
    orderCity : state.Order.city,
    orderZipCode : state.Order.zipCode,
    totalOrder : state.Order.totalOrder,
    discountOrder : state.Order.discount,
    discountId: state.Order.discountId
  }
}

function mapDispatchToProps(dispatch) {
  return {
    orderValidate : function(userPoints) {
      dispatch({
        type : 'resetPanier',
        userPoints: userPoints
      })
    },
    resetOrder : function() {
      dispatch({
        type : 'resetOrder',
      })
    },
    deleteDiscountCoupon : function() {
      dispatch({
          type: 'deleteDiscountCoupon',
      })
    }
  }
}


export default connect(
  mapStateToProps, 
  mapDispatchToProps
) (injectStripe(CheckoutForm))
/* eslint-disable */
import axios from 'axios';
import showAlert from './alerts';
const stripe = Stripe('pk_test_cOlqWQa0HxRJ5HP0tKAjWGCJ00pb9mnA6v');

const bookTour = async tourId => {
  try {
    // 1) Get checkout session from endpoint from API
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

export { bookTour };

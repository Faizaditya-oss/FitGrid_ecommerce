const STORAGE_KEY = 'fitgrid_payments';

export const paymentService = {
  getPayments: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  createPayment: (payment) => {
    const payments = paymentService.getPayments();
    const newPayment = {
      ...payment,
      id: payment.id || `PAY-${Date.now()}`,
      date: new Date().toISOString()
    };
    payments.unshift(newPayment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
    window.dispatchEvent(new Event('payments_updated'));
    return newPayment;
  },

  updatePaymentStatus: (paymentId, status) => {
    const payments = paymentService.getPayments();
    const index = payments.findIndex(p => p.id === String(paymentId));
    if (index !== -1) {
      payments[index].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
      window.dispatchEvent(new Event('payments_updated'));
      return payments[index];
    }
    return null;
  }
};

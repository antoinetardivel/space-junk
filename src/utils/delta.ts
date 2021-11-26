const delta = (number1: number, number2: number) => {
  if (number1 > number2) {
    return number1 - number2;
  } else if (number2 > number1) {
    return number2 - number1;
  } else {
    return 0;
  }
};
export default delta;

const emailValidation = async (email: any) => {
  const validEmail = email.toLowerCase();
  if (
    validEmail.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return validEmail;
  } else {
    console.log("email error");

    throw new Error("email doesn't match");
  }
};
export default emailValidation;

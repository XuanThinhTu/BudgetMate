import axios from "../util/axios.customize";

export const loginFunction = async (mail, pass) => {
  try {
    const login = await axios.post("/auth/login", {
      email: mail,
      password: pass,
    });
    return login.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (mail) => {
  try {
    const res = await axios.post("/user/forgot-password", { email: mail });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const registerFunction = async (mail, pass, name, phone, address) => {
  try {
    const regis = await axios.post("/user/register", {
      email: mail,
      password: pass,
      fullName: name,
      phone: phone,
      address: address,
    });
    return regis.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAuthenticatedUser = async () => {
  try {
    const user = await axios.get("/user/c");
    console.log(user.data.data);
    return user.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserWallets = async () => {
  try {
    const wallet = await axios.get("/wallet");
    return wallet.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getWalletBalance = async (id) => {
  try {
    const res = await axios.get(`/transaction/wallet/${id}/summary`);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionsByWalletId = async (walletId) => {
  try {
    const res = await axios.get(`/transaction/wallet/${walletId}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewTransaction = async (payload) => {
  try {
    const res = await axios.post("/transaction", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateTransaction = async (id, payload) => {
  try {
    console.log(id);
    const res = await axios.put(`/transaction/${id}`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTransaction = async (id) => {
  try {
    const res = await axios.delete(`/transaction/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewWallet = async (payload) => {
  try {
    const res = await axios.post("/wallet", payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCategories = async () => {
  try {
    const res = await axios.get("/category");
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getQuizStatus = async () => {
  try {
    const res = await axios.get("/quizzes/status");
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserDailyQuizzes = async () => {
  try {
    const quiz = await axios.get("/quizzes/daily");
    return quiz.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const submitAnswer = async (payload) => {
  try {
    const res = await axios.post("/quizzes/submit", payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

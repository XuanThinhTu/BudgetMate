import axios from "../util/axios.customize";

//================== USER =======================
export const verifyUserFunction = async (userToken) => {
  try {
    const res = await axios.post("/user/verify", {
      token: userToken,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (payload) => {
  try {
    const res = await axios.post("/user/reset-password", payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentStatus = async (orderCode, status) => {
  try {
    const res = await axios.post(
      `/payment/confirm?orderCode=${orderCode}&status=${status}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//================== ADMIN ======================

export const loginFunction = async (payload) => {
  try {
    const login = await axios.post("/auth/login", payload);
    return login.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllQuizzes = async () => {
  try {
    const quiz = await axios.get(
      "/questions?sortBy=createdAt&sortDirection=desc&page=0&size=10"
    );
    return quiz.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewQuestion = async (payload) => {
  try {
    const res = await axios.post("/questions", payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateQuestion = async (id, payload) => {
  try {
    const res = await axios.put(`/questions/${id}`, payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestion = async (id) => {
  try {
    const res = await axios.delete(`/questions/${id}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get("/user/admin/getAll");
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const banUserFunction = async (id) => {
  try {
    const res = await axios.put(`/user/admin/ban?user=${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const unbanUserFunction = async (id) => {
  try {
    const res = await axios.put(`/user/admin/activate?user=${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllMemberships = async () => {
  try {
    const res = await axios.get("/memberships");
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewMembership = async (payload) => {
  try {
    const res = await axios.post("/memberships", payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateMembership = async (id, payload) => {
  try {
    const res = await axios.put(`/memberships/${id}`, payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMembership = async (id) => {
  try {
    const res = await axios.delete(`/memberships/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllFeatures = async () => {
  try {
    const res = await axios.get("/features");
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewFeature = async (payload) => {
  try {
    const res = await axios.post("/features", payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasableFeatures = async () => {
  try {
    const res = await axios.get("/purchasable-features");
    return res.data.data.content;
  } catch (error) {
    console.log(error);
  }
};

export const addNewPurchasableFeature = async (payload) => {
  try {
    const res = await axios.post("/purchasable-features", payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const updatePurchasableFeature = async (id, payload) => {
  try {
    const res = await axios.put(`/purchasable-features/${id}`, payload);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePurchasableFeature = async (id) => {
  try {
    const res = await axios.delete(`/purchasable-features/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getRevenueByRange = async (range, start, end) => {
  try {
    if (start && end) {
      console.log("start", start);
      console.log("end", end);
      const res = await axios.get(
        `/admin/analytics/revenue?period=${range}&startDate=${start}&endDate=${end}`
      );
      return res.data.data;
    } else {
      const res = await axios.get(`/admin/analytics/revenue?period=${range}`);
      return res.data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const membershipBreakdown = async (start, end) => {
  try {
    const res = await axios.get(
      `/admin/analytics/revenue/membership?startDate=${start}&endDate=${end}`
    );
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

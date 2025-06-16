import { IMAGE_UPLOAD_URL, API_URL } from "@/constants/appConstant";

export default {
  getProducts() {
    return new Promise((resolve, reject) => {
      fetch(API_URL + "products")
        .then((response) => response.json())
        .catch((err) => reject(err))
        .then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  },

  deleteProduct(productId) {
    return new Promise((resolve, reject) => {
      fetch(`${API_URL}products/${productId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .catch((err) => reject(err))
        .then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  },

  addProducts(productObj) {
    return new Promise((resolve, reject) => {
      fetch(API_URL + "products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productObj),
      })
        .then((response) => response.json())
        .catch((err) => reject(err))
        .then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  },

  editProducts(productObj, productId) {
    return new Promise((resolve, reject) => {
      fetch(API_URL + "products/" + productId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productObj),
      })
        .then((response) => response.json())
        .catch((err) => reject(err))
        .then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  },

  getProduct(productId) {
    return new Promise((resolve, reject) => {
      fetch(API_URL + "products/" + productId)
        .then((response) => response.json())
        .catch((err) => {
          reject(err);
        })
        .then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  },

  uploadImage(formData) {
    return new Promise((resolve, reject) => {
      fetch(IMAGE_UPLOAD_URL, { method: "POST", body: formData })
        .then((response) => response.json())
        .catch((err) => reject(err))
        .then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  },
};

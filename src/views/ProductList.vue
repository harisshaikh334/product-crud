<template>
    <Loader v-if="isLoad" />
    <div class="content-wrapper">
        <div class="container my-3">
            <h1 class="text-center mb-5">Our Products</h1>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="productList">
                <!-- Product items will be dynamically loaded here by JavaScript in a real app -->
                <div v-for="item of productList" :key="item.id"  class="col">
                    <div class="card h-100 shadow-sm">
                        <img :src="item?.image" class="card-img-top" alt="Gaming Laptop" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">{{item?.title}}</h5>
                            <p class="card-text mb-1"><strong>Price:</strong> ${{item?.price}}</p>
                            <p class="card-text"><span class="badge bg-secondary">{{item.category}}</span></p>
                            <div class="card-actions">
                                <RouterLink :to="'update-product/'+item.id"><button type="button" class="btn btn-sm btn-primary w-50">Edit</button></RouterLink>
                                <button type="button" @click="handleDelete(item)" class="btn btn-sm btn-danger w-50">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>    
                <!-- Add more product items as needed -->
            </div>
        </div>
    </div>
</template>
<script setup>
    import {onMounted, reactive, ref} from "vue";
    import { RouterLink } from "vue-router";
    import Loader from "@/components/layouts/Loader.vue";
    import productService from '@/services/productService';
    import { useSwal } from '@/utility/useSwal';

    const {showSuccess, showError, showConfirm} = useSwal();
    
    let productList = reactive([]);
    let isLoad = ref(false);
    onMounted(() => {
        fetchProductList();
    })


    const handleDelete = async (data) => {
        const confirm = await showConfirm("message");
        if (confirm.isConfirmed) {
            isLoad.value = true;
            productService.deleteProduct(data.id).then(() => {
                showSuccess("product deleted successfully.");
                isLoad.value = false;
                productList.length = 0;
                fetchProductList();
            }, (err) => {
                showError("Something went wrong. Please try again later.")
                console.log("delete err ", err);
            })
        }
        
    }

    const fetchProductList = () => {
        isLoad.value = true;
        productService.getProducts().then((data) => {
            productList.length = 0;
            data.forEach(element => {
                productList.push(element);
            });
            isLoad.value = false;
                
        }, (err) => {
             isLoad.value = false;
            console.log("err ", err);
        })
    }
</script>
<style scoped>
.card-body {
    display: flex;
    flex-direction: column; /* Stack content vertically */
    justify-content: space-between; /* Pushes content to top and bottom within the body */
}
/* Push the action buttons to the bottom of the card-body */


</style>
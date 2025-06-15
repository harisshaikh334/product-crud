<template>
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
    import {onMounted, reactive} from "vue";
    import { RouterLink } from "vue-router";
    
    let productList = reactive([]);

    onMounted(() => {
        fetchProductList();
    })


    const handleDelete = (data) => {
        console.log("delete click ", data);
        fetch('https://fakestoreapi.com/products/1', {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data =>{
                 alert("product deleted successfully.");
                 productList.length = 0;
                 fetchProductList();
            });

    }

    const fetchProductList = () => {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                console.log("data is ", data);
                productList = data;
            })
    }
</script>
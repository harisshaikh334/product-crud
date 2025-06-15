
<template>
    <div class="content-wrapper">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card p-5 shadow-lg">
                        <h1 class="display-1 text-danger mb-4">404</h1>
                        <h2 class="mb-3">Page Not Found</h2>
                        <p class="lead mb-4">
                            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
                        <RouterLink to="/" class="btn btn-primary btn-lg">
                            <i class="bi bi-house-door-fill me-2"></i>Go to Homepage
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {RouterLink} from "vue-router";
</script>
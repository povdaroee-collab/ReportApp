<template>
  <div id="app">
    <router-view /> <SystemLicenseGuard />
  </div>
</template>

<script setup>
// សូម Import តាមទីតាំងជាក់ស្តែងដែលបងបាន Save ខាងលើ
import SystemLicenseGuard from '@/components/SystemLicenseGuard.vue'; 
</script>
<script setup>
// លុបកូដ PWA ដែលមានពីមុនចេញទាំងអស់
// នាំចូល (Import) ផ្ទាំង System License Guard ដើម្បីឲ្យវាដើរតួជា Global
import SystemLicenseGuard from '@/components/SystemLicenseGuard.vue';
</script>

<template>
  <router-view />
  
  <SystemLicenseGuard />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Battambong:wght@400;700;900&family=Kantumruy+Pro:wght@400;700;900&display=swap');
.font-khmer { font-family: 'Kantumruy Pro', 'Battambong', sans-serif; }
</style>
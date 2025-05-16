

<template>
   <div class="space-y-6 p-6 ml-20">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Document Tracking System</h1>
          <p class="text-muted-foreground">
            Manage and track employee/contractor documents and their processing status
          </p>
        </div>
        <MazBtn class="shrink-0" size="sm" color="black" >
          <PlusCircle class="h-4 w-4" />
          Add New Record
        </MazBtn>
      </div>

    <DocumentStats :pending="12" :inProgress="7" :completed="20" />
</div>
</template>

<script setup lang="ts">
import { PlusCircle } from 'lucide-vue-next';
import DocumentStats from './DocumentStats.vue'
</script>
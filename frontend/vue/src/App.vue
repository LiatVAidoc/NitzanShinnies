<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>DICOM Metadata Viewer</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <h1 class="text-h4 mb-5">DICOM Metadata Viewer</h1>
        
        <!-- S3 Path Form -->
        <v-card class="mb-5">
          <v-card-title>Enter S3 Path</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="fetchDicomMetadata">
              <v-text-field
                v-model="s3Path"
                label="S3 Path"
                placeholder="bucket-name/path/to/file.dcm"
                :rules="[v => !!v || 'S3 Path is required']"
                required
              ></v-text-field>
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="loading"
              >
                Fetch Metadata
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Metadata Display -->
        <v-card v-if="metadata">
          <v-card-title>DICOM Metadata</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Tag</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <!-- To be implemented by candidate -->
                <tr>
                  <td colspan="2">Metadata will be displayed here</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Error Display -->
        <v-alert
          v-if="error"
          type="error"
          class="mt-4"
        >
          {{ error }}
        </v-alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      s3Path: '',
      metadata: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchDicomMetadata() {
      // To be implemented by candidate
      this.error = 'Not implemented yet';
    }
  }
};
</script> 
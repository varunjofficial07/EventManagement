import { supabase } from "./supabase";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: any;
}

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder path in storage (e.g., 'events', 'profiles')
 * @param fileName - Optional custom file name, otherwise uses timestamp
 * @returns Upload result with URL or error
 */
export async function uploadImage(
  file: File,
  folder: string = "events",
  fileName?: string
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: { message: "File must be an image" },
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: { message: "Image size must be less than 5MB" },
      };
    }

    // Generate unique file name
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const finalFileName = fileName || `${timestamp}-${randomStr}.${fileExt}`;
    const filePath = `${folder}/${finalFileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from("event-images") // Make sure this bucket exists in Supabase Storage
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("event-images").getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: {
        message: error.message || "Failed to upload image",
      },
    };
  }
}

/**
 * Delete an image from Supabase Storage
 * @param filePath - The path to the file in storage
 * @returns Success status
 */
export async function deleteImage(filePath: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.storage.from("event-images").remove([filePath]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: {
        message: error.message || "Failed to delete image",
      },
    };
  }
}


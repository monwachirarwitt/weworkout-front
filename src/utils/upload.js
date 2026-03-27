import axios from "axios";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // ใช้ Preset เก่าของคุณมลที่เคยสมัครไว้แล้วได้เลย
    formData.append('upload_preset', 'cc22-upload'); 
    
    // ยิง API ไปที่ Cloudinary (ตรง url มีชื่อ cloud_name: du8w3dd0w อยู่แล้ว)
    const resp = await axios.post(
      'https://api.cloudinary.com/v1_1/du8w3dd0w/image/upload', 
      formData
    );
    
    console.log('✅ Upload Success! URL:', resp.data.secure_url);
    return resp.data.secure_url; 
    
  } catch (err) {
    console.error('❌ Cloudinary Upload Error:', err);
    throw err; 
  }
};
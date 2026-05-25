import axios from '../config/axios';

/**
 * User API
 * รวม function ทุกอย่างที่เกี่ยวกับ User Profile
 */

// อัปเดตข้อมูล profile
export const updateProfile = (payload) => {
  return axios.put('/user/profile', payload);
};

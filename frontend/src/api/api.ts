import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL + "/api/releases";

export interface Step {
  step_index: number;
  is_completed: boolean;
}

export interface Release {
  id: number;
  name: string;
  date: string;
  status: string;
  additional_info?: string;
  steps?: boolean[];  // ← simple boolean array now
}

// Get all releases
export const getReleases = async (): Promise<Release[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// Get one release with steps
export const getRelease = async (id: number): Promise<Release> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// Create a new release
export const createRelease = async (data: {
  name: string;
  date: string;
  additional_info?: string;
}): Promise<Release> => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

// Update additional info
export const updateRelease = async (
  id: number,
  additional_info: string
): Promise<Release> => {
  const res = await axios.put(`${BASE_URL}/${id}`, { additional_info });
  return res.data;
};

// Delete a release
export const deleteRelease = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

// Toggle a step
export const toggleStep = async (
  releaseId: number,
  stepIndex: number,
  is_completed: boolean
): Promise<void> => {
  await axios.put(`${BASE_URL}/${releaseId}/steps/${stepIndex}`, {
    is_completed,
  });
};
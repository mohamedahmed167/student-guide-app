import { env } from "../environment/environment";
import { apiRequest } from "./client";
import {
  mapApiChatToAnnouncement,
  mapApiScheduleToLocal,
  mapApiTodoToLocal,
  mapLocalScheduleToApi,
} from "./mappers";

export async function getDepartments() {
  return apiRequest(env.endpoints.departments, { auth: false });
}

export async function getStudents() {
  return apiRequest(env.endpoints.students, { auth: false });
}

export async function getSchedules() {
  const data = await apiRequest(env.endpoints.schedules, { auth: false });
  return Array.isArray(data) ? data.map(mapApiScheduleToLocal) : [];
}

export async function createSchedule(formData) {
  const body = mapLocalScheduleToApi(formData);
  const created = await apiRequest(env.endpoints.schedules, {
    method: "POST",
    body,
  });
  return mapApiScheduleToLocal(created);
}

export async function deleteSchedule(scheduleId) {
  return apiRequest(`${env.endpoints.schedules}${scheduleId}/`, { method: "DELETE" });
}

export async function getExams() {
  return apiRequest(env.endpoints.exams, { auth: false });
}

export async function createExam(exam) {
  return apiRequest(env.endpoints.exams, { method: "POST", body: exam });
}

export async function getTodos() {
  const data = await apiRequest(env.endpoints.todos);
  return Array.isArray(data) ? data.map(mapApiTodoToLocal) : [];
}

export async function createTodo(task_name) {
  const created = await apiRequest(env.endpoints.todos, {
    method: "POST",
    body: { task_name, is_completed: false },
  });
  return mapApiTodoToLocal(created);
}

export async function updateTodo(id, updates) {
  const updated = await apiRequest(`${env.endpoints.todos}${id}/`, {
    method: "PATCH",
    body: updates,
  });
  return mapApiTodoToLocal(updated);
}

export async function deleteTodo(id) {
  return apiRequest(`${env.endpoints.todos}${id}/`, { method: "DELETE" });
}

export async function getChats() {
  const data = await apiRequest(env.endpoints.chats);
  return Array.isArray(data) ? data.map(mapApiChatToAnnouncement) : [];
}

export async function createChat(content) {
  const created = await apiRequest(env.endpoints.chats, {
    method: "POST",
    body: { content },
  });
  return mapApiChatToAnnouncement(created);
}

export async function updateProfile(formData) {
  const body = {};

  if (formData.name) body.full_name = formData.name;
  if (formData.email) body.email = formData.email;
  if (formData.department) body.department = formData.department;
  if (formData.currentLevel) body.current_level = formData.currentLevel;
  if (formData.gpa !== undefined) body.current_cgpa = String(formData.gpa);
  if (formData.credits !== undefined) body.total_credits = formData.credits;

  return apiRequest(env.endpoints.profileUpdate, {
    method: "PATCH",
    body,
  });
}

export async function changePassword({ old_password, new_password }) {
  return apiRequest(env.endpoints.changePassword, {
    method: "PUT",
    body: { old_password, new_password },
  });
}

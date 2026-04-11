import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../services/api";
import useStudentStore from "../store/useStudentStore";
import { useEffect } from "react";

const STUDENT_ID = 1;

export function useStudent() {
  const setStudent = useStudentStore((s) => s.setStudent);

  const query = useQuery({
    queryKey: ["student", STUDENT_ID],
    queryFn: async () => {
      const data = await studentService.getById(STUDENT_ID);
      console.log("RAW API RESPONSE:", JSON.stringify(data, null, 2)); // 👈 add this
      return Array.isArray(data) ? data[0] : data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) setStudent(query.data);
  }, [query.data, setStudent]);

  return query;
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const setStudent = useStudentStore((s) => s.setStudent);

  return useMutation({
    mutationFn: (data) => studentService.update(STUDENT_ID, data),
    onSuccess: (updated) => {
      const normalized = Array.isArray(updated) ? updated[0] : updated;
      setStudent(normalized);
      queryClient.invalidateQueries(["student", STUDENT_ID]);
    },
  });
}

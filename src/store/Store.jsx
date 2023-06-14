import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      //theme: "dark",
      ChangeTheme: (value) => set((state) => ({ theme: value })),
      // ClearStore: () => {
      //   set({}, true);
      // },
    }),
    { name: "theme" }
  )
);

export const useAlertStore = create((set) => ({
  MsgOpen: false,
  SeverityMsg: "error",
  Msg: "Message",
  Duration: 1000,
  PositionV: "top",
  PositionH: "center",
  ChangeMsgOpen: (value) => set((state) => ({ MsgOpen: value })),
  ChangeSeverity: (value) => set((state) => ({ SeverityMsg: value })),
  ChangeMsg: (value) => set((state) => ({ Msg: value })),
  ChangeDuration: (value) => set((state) => ({ Duration: value })),
  ChangePositionV: (value) => set((state) => ({ PositionV: value })),
  ChangePositionH: (value) => set((state) => ({ PositionH: value })),
}));

export const useUserDataStore = create(
  persist(
    (set) => ({
      logged: false,
      token: "",
      user_data: "",
      ChangeLogged: (value) => set((state) => ({ logged: value })),
      ChangeToken: (value) => set((state) => ({ token: value })),
      ChangeUser_Data: (value) => set((state) => ({ user_data: value })),
      ClearStore: () => {
        set({ logged: false, token: "", user_data: "" });
      },
    }),
    { name: "UserData", storage: createJSONStorage(() => sessionStorage) }
  )
);

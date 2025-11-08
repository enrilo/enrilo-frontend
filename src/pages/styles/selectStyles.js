export const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "56px",
    height: "56px",
    borderRadius: "4px",
    borderColor: state.isFocused ? "#2563EB" : "#E0E0E0",
    boxShadow: "none",
    "&:hover": { borderColor: "#2563EB" },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export const asteriskColorStyle = {
    "& .MuiFormLabel-asterisk": {
        color: "red",
    },
};

export const slotPropsStyle = { 
    input:{ 
        style:{ 
            height: "56px" 
        } 
    } 
};

export const selectAndPreviewDocStyle = {
    textTransform: "none",
    borderColor: "#2563EB",
    color: "#2563EB",
    "&:hover": { borderColor: "#1D4ED8", background: "#EFF6FF" },
}
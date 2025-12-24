export const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "56px",
    height: "56px",
    borderRadius: "4px",
    borderColor: state.isFocused ? "#2563EB" : "#E0E0E0",
    boxShadow: "none",
    cursor:"pointer",
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

export const selectDocumentBtnStyle = {
    textTransform: "none",
    borderColor: "#2563EB",
    color: "#2563EB",
    height: "56px",
    "&:hover": { borderColor: "#1D4ED8", background: "#EFF6FF" },
}

export const previewDocumentBtnStyle = {
    textTransform: "none",
    borderColor: "#2563EB",
    color: "#2563EB",
    height: "40px",
    "&:hover": { borderColor: "#1D4ED8", background: "#EFF6FF" },
}
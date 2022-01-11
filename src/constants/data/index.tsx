import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';

export const designationNames = [
  { value: "DON", label: "Director Of Nursing (DON)" },
  { value: "DSD", label: "Director Of Staffing development (DSD)" },
  { value: "FA", label: "Facility Administrator (FA)" },
  { value: "AP", label: "Accounts Payable (AP)" },
  { value: "SC", label: "Staffing Coordinator (SC)" },
];

export const otHours = [
  { value: 40, label: "40 Hrs/Week" },
  { value: 8, label: "8 Hrs/Day" },
];

export const shiftType = [
  {
    value: "AM",
    label: "AM",
  },
  {
    value: "PM",
    label: "PM",
  },
  {
    value: "NOC",
    label: "NOC",
  },

  {
    value: "AM-12",
    label: "AM-12",
  },

  {
    value: "PM-12",
    label: "PM-12",
  },
];



export const genderTypes = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];


export const warningZone = [
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "red", label: "Red" },
];


export const cardMenuActions = [
  {
    icon: <EditIcon />, label: "Edit"
  }, {
    icon: <DeleteIcon />, label: "Delete"
  }, {
    icon: <StarIcon />, label: "Star"
  },
]

export const calenderMode = [
  {
    value: 'multiple', label: 'Multiple Dates'
  },
  {
    value: 'range', label: 'Date Range'
  }
]


export const acknowledgement = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
]

export const boolAcknowledge = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
]


export const shiftTypePreference = [
  {
    value: "AM",
    label: "AM",
  },
  {
    value: "PM",
    label: "PM",
  },
  {
    value: "NOC",
    label: "NOC",
  },
  {
    value: "AM,PM",
    label: "AM and PM",
  },
  {
    value: "PM,NOC",
    label: "PM and NOC",
  },
  {
    value: "NOC,AM",
    label: "NOC and AM",
  },
];

export const moreImportant = [
  {
    value: "money",
    label: "Money",
  },
  {
    value: "location",
    label: "Location",
  },
]


export const covidPreference = [
  {
    value: "covid",
    label: "Covid",
  },
  {
    value: "non_covid",
    label: "Non Covid",
  },

  {
    value: "both",
    label: "Both",
  },
]

export const vaccine = [
  {
    value: "full",
    label: "Fully Vaccinated",
  },
  {
    value: "half",
    label: "1st Dose",
  },
  {
    value: "exempted",
    label: "Exempted",
  },
]


export const contactType = [
  {
    value: "email",
    label: "Email",
  },
  {
    value: "text_message",
    label: "Text Message",
  },
  {
    value: "voicemail",
    label: "Voicemail",
  },
  {
    value: "chat",
    label: "Chat",
  },
]



export const gustoType = [
  {
    value: "direct_deposit",
    label: "Direct Deposit",
  }, {
    value: "paycheck",
    label: "Paycheck",
  },
]


export const AllShiftStatusList = [
  { name: "In Progress", code: "in_progress" },
  { name: "Cancelled", code: "cancelled" },
  { name: "Complete", code: "complete" },
  { name: "Closed", code: "closed" },
  { name: "Pending", code: "pending" },
]

export const SomeShiftStatusList = [
  { name: "Published", code: "published" },
  { name: "Cancelled", code: "cancelled" },
]



export const americanTimeZone = [
  { value: 720, label: "(UTC−12:00) Baker Island and Howland Island " },
  { value: 660, label: "(UTC−11:00) (ST) American Samoa, Jarvis Island, Kingman Reef, Midway Atoll and Palmyra Atoll" },
  { value: 600, label: "(UTC−10:00) (HT) Hawaii, most of the Aleutian Islands, and Johnston Atoll" },
  { value: 540, label: "(UTC−09:00) (AKT) Most of the State of Alaska " },
  { value: 480, label: "(UTC−08:00) (PT) Pacific Time zone: the Pacific coast states, the Idaho panhandle and most of Nevada and Oregon " },
  { value: 420, label: "(UTC−07:00) (MT) Mountain Time zone: most of Idaho, part of Oregon, and the Mountain states plus western parts of some adjacent states " },
  { value: 360, label: "(UTC-06:00) (CT) Central Time zone: a large area spanning from the Gulf Coast to the Great Lakes " },
  { value: 300, label: "(UTC−05:00) (ET) Eastern Time zone: roughly a triangle covering all the states from the Great Lakes down to Florida and east to the Atlantic coast" },
  { value: 240, label: "((UTC−04:00) AST) Puerto Rico, the U.S. Virgin Islands  " },
  { value: -600, label: "(UTC+10:00) (ChT) Guam and the Northern Mariana Islands " },
  { value: -720, label: "(UTC+12:00) Wake Island " },
]
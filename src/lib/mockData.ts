export const mockDB = {
  students: [
    { rollNo: '715535243011', name: 'Aparna' },
    { rollNo: '715525243008', name: 'Amish' },
    { rollNo: '715525243012', name: 'Arjun' },
    { rollNo: '715525243010', name: 'Anu' },
  ],
  
  departments: [
    {
      name: 'AI & DS',
      faculty: [
        { name: 'Dr. Sangeetha', title: 'Dr.' },
        { name: 'Mrs. Nirangana', title: 'Mrs.' },
      ],
    },
    {
      name: 'CSE',
      faculty: [
        { name: 'Dr. Rajesh', title: 'Dr.' },
        { name: 'Prof. Meera', title: 'Prof.' },
        { name: 'Mr. Kannan', title: 'Mr.' },
      ],
    },
    {
      name: 'ECE',
      faculty: [
        { name: 'Dr. Karthik', title: 'Dr.' },
        { name: 'Mrs. Priya', title: 'Mrs.' },
        { name: 'Mr. Sanjay', title: 'Mr.' },
      ],
    },
  ],
};

export type TimeSlot = {
  time: string;
  subject?: string;
  className?: string;
  period?: number;
  available?: boolean;
};

export type DaySchedule = {
  day: string;
  slots: TimeSlot[];
};

// Mock timetable data for faculty
export const generateFacultyTimetable = (facultyName: string): DaySchedule[] => {
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Different class schedules for different faculty
  const facultySchedules: { [key: string]: any } = {
    'Dr. Sangeetha': {
      subjects: ['Machine Learning', 'Deep Learning', 'AI Fundamentals', 'Data Science'],
      classes: ['AI & DS - III A', 'AI & DS - III B', 'AI & DS - II A', 'AI & DS - IV A'],
    },
    'Mrs. Nirangana': {
      subjects: ['Python Programming', 'Data Structures', 'Algorithms', 'Database Systems'],
      classes: ['AI & DS - II A', 'AI & DS - II B', 'AI & DS - III A', 'AI & DS - I A'],
    },
    'Dr. Rajesh': {
      subjects: ['Operating Systems', 'Computer Networks', 'System Design', 'Distributed Systems'],
      classes: ['CSE - III A', 'CSE - III B', 'CSE - IV A', 'CSE - II A'],
    },
    'Prof. Meera': {
      subjects: ['Software Engineering', 'Web Technologies', 'Cloud Computing', 'Mobile App Dev'],
      classes: ['CSE - II A', 'CSE - II B', 'CSE - III A', 'CSE - IV B'],
    },
    'Mr. Kannan': {
      subjects: ['Data Mining', 'Big Data Analytics', 'IoT', 'Cyber Security'],
      classes: ['CSE - III B', 'CSE - IV A', 'CSE - II A', 'CSE - III A'],
    },
    'Dr. Karthik': {
      subjects: ['Digital Electronics', 'VLSI Design', 'Embedded Systems', 'Signal Processing'],
      classes: ['ECE - III A', 'ECE - III B', 'ECE - IV A', 'ECE - II A'],
    },
    'Mrs. Priya': {
      subjects: ['Communication Systems', 'Microprocessors', 'Control Systems', 'Networks'],
      classes: ['ECE - II A', 'ECE - II B', 'ECE - III A', 'ECE - I A'],
    },
    'Mr. Sanjay': {
      subjects: ['Electromagnetic Theory', 'Antenna Design', 'RF Engineering', 'Wireless Tech'],
      classes: ['ECE - III B', 'ECE - IV A', 'ECE - II A', 'ECE - III A'],
    },
  };

  const schedule = facultySchedules[facultyName] || {
    subjects: ['Lecture', 'Tutorial', 'Lab Session'],
    classes: ['Class A', 'Class B', 'Class C'],
  };

  return days.map((day, dayIdx) => {
    const slots = timeSlots.map((time, slotIdx) => {
      const period = slotIdx + 1;
      
      if (time === '1:00 PM - 2:00 PM') {
        return { time, subject: 'Lunch Break', period };
      }

      // Create a deterministic schedule based on day and slot
      const isOccupied = (dayIdx + slotIdx) % 3 !== 0;
      
      if (isOccupied) {
        const subjectIdx = (dayIdx * slotIdx) % schedule.subjects.length;
        const classIdx = (dayIdx + slotIdx) % schedule.classes.length;
        
        return {
          time,
          period,
          subject: schedule.subjects[subjectIdx],
          className: schedule.classes[classIdx],
        };
      }

      return { time, period, available: true };
    });

    return { day, slots };
  });
};

// Available meeting times posted by faculty
export const mockAvailableMeetTimes = [
  {
    faculty: 'Dr. Sangeetha',
    slots: [
      { date: '2025-12-16', time: '2:00 PM - 3:00 PM' },
      { date: '2025-12-17', time: '3:00 PM - 4:00 PM' },
      { date: '2025-12-18', time: '10:00 AM - 11:00 AM' },
    ],
  },
  {
    faculty: 'Prof. Meera',
    slots: [
      { date: '2025-12-16', time: '11:00 AM - 12:00 PM' },
      { date: '2025-12-19', time: '2:00 PM - 3:00 PM' },
    ],
  },
];
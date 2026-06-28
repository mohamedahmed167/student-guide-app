import os
import django

# 1. تظبيط بيئة جانجو عشان السكريبت يقدر يكلم الداتابيز
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_guide.settings')
django.setup()

# 2. استدعاء المودل بتاعك بالاسم الصح من التطبيق
from api.models import Subject

# 3. الداتا متفلترة وجاهزة على قد الحقول بتاعتك بالظبط
courses_data = [
    # Level 2 - Semester 1
    {"code": "CS2101", "title": "Computer Systems", "credit_hours": 3},
    {"code": "CS2103", "title": "Computer Programming", "credit_hours": 3},
    {"code": "MA2103", "title": "Abstract Algebra", "credit_hours": 3},
    {"code": "MA2105", "title": "Mathematical Analysis 1", "credit_hours": 3},
    {"code": "TS2103", "title": "Translation Skills", "credit_hours": 1},
    {"code": "MA2107", "title": "Discrete Mathematics", "credit_hours": 2},
    {"code": "MA2121", "title": "Mathematical Methods", "credit_hours": 3},
    {"code": "ST2101", "title": "Probability Theory 1", "credit_hours": 2},
    {"code": "CS2105", "title": "File Processing", "credit_hours": 3},

    # Level 2 - Semester 2
    {"code": "MA2208", "title": "Mathematical Analysis 2", "credit_hours": 3},
    {"code": "MA2220", "title": "Linear Algebra and Solid Geometry", "credit_hours": 3},
    {"code": "CS2202", "title": "Logic Design", "credit_hours": 3},
    {"code": "CS2204", "title": "Data Structures and Algorithms", "credit_hours": 3},
    {"code": "MA2212", "title": "Number Theory", "credit_hours": 3},
    {"code": "CS2206", "title": "Database Systems", "credit_hours": 3},
    {"code": "CS2208", "title": "Object-Oriented Programming", "credit_hours": 3},
    {"code": "ST2206", "title": "Statistical Inference 1", "credit_hours": 3},

    # Level 3 - Semester 1
    {"code": "MA3103", "title": "Numerical Analysis 1", "credit_hours": 3},
    {"code": "MA3113", "title": "Mathematical Logic and Boolean Algebra", "credit_hours": 3},
    {"code": "CS3101", "title": "Computer Systems and Assembly Language", "credit_hours": 3},
    {"code": "CS3103", "title": "Design and Analysis of Algorithms", "credit_hours": 3},
    {"code": "MA3121", "title": "Real Analysis and Measure Theory", "credit_hours": 2},
    {"code": "MA3125", "title": "Abstract Algebra and Topology", "credit_hours": 2},
    {"code": "CS3105", "title": "Combinatorics and Graph Theory", "credit_hours": 3},
    {"code": "CS3107", "title": "Programming Language Concepts", "credit_hours": 3},

    # Level 3 - Semester 2
    {"code": "CS3202", "title": "Automata Theory", "credit_hours": 3},
    {"code": "CS3204", "title": "Operating Systems", "credit_hours": 3},
    {"code": "CS3206", "title": "Computer Architecture", "credit_hours": 3},
    {"code": "CS3208", "title": "Systems Simulation", "credit_hours": 3},
    {"code": "MA3210", "title": "Optimal Control 1", "credit_hours": 3},
    {"code": "CS3210", "title": "Systems Analysis and Design", "credit_hours": 3},
    {"code": "CS3212", "title": "Software Design and Analysis", "credit_hours": 3},
    {"code": "ST3212", "title": "Stochastic Processes", "credit_hours": 3},

    # Level 4 - Semester 1
    {"code": "MA4105", "title": "Operations Research 1", "credit_hours": 3},
    {"code": "CS4101", "title": "Database Systems", "credit_hours": 3},
    {"code": "CS4103", "title": "Theory of Computation", "credit_hours": 3},
    {"code": "CS4105", "title": "Computer Graphics", "credit_hours": 3},
    {"code": "CS4107", "title": "Advanced Java Programming", "credit_hours": 2},
    {"code": "CS4109", "title": "Selected Topics in Computer Science", "credit_hours": 3},
    {"code": "CS4111", "title": "Expert Systems", "credit_hours": 3},
    {"code": "MA4121", "title": "Modern Algebra and Topology", "credit_hours": 2},

    # Level 4 - Semester 2
    {"code": "CS4202", "title": "Research and Essay", "credit_hours": 2},
    {"code": "CS4204", "title": "Compiler Design", "credit_hours": 2},
    {"code": "CS4206", "title": "Image Processing", "credit_hours": 2},
    {"code": "CS4208", "title": "Computer Security Technology", "credit_hours": 3},
    {"code": "CS4210", "title": "Computer Networks", "credit_hours": 3},
    {"code": "MA4224", "title": "Optimal Control 2", "credit_hours": 2},
    {"code": "CS4212", "title": "Distributed Systems", "credit_hours": 2},
    {"code": "CS4214", "title": "Neural Networks", "credit_hours": 2},
    {"code": "ST4204", "title": "Time Series Analysis", "credit_hours": 2},
]

def seed():
    subjects_to_create = []
    for data in courses_data:
        # ربط الداتا بأسماء الحقول الفعلية في مودل Subject
        subject = Subject(
            subject_code=data['code'],
            name=data['title'],
            credits=data['credit_hours']
        )
        subjects_to_create.append(subject)
    
    # ignore_conflicts=True بتخلي جانجو يتجاهل المادة لو هي متسجلة قبل كده (عشان الـ subject_code معمول unique)
    Subject.objects.bulk_create(subjects_to_create, ignore_conflicts=True)
    print("🚀 تم إضافة جميع المواد في قاعدة البيانات بنجاح!")

if __name__ == '__main__':
    seed()
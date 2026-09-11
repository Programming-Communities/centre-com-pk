"use client";

import {useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, Calculator } from "lucide-react";
import ResponsiveToolWrapper from "@/components/tools/ResponsiveToolWrapper/ResponsiveToolWrapper.client";
import { useTheme } from '@/components/theme';
import { useParams } from 'next/navigation';

import ToolContentRenderer from "@/components/tools/ToolContentRenderer";

interface Course {
  id: number;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,

  'F': 0.0,
};

const grades = Object.keys(gradePoints);

export default function GPACalculatorClient() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Mathematics', credits: 3, grade: 'A' },
    { id: 2, name: 'Physics', credits: 4, grade: 'B+' },
    { id: 3, name: 'Chemistry', credits: 3, grade: 'A-' },
  ]);
  const [gpa, setGpa] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  
  const { themeColors } = useTheme();
  
  // ✅ HYDration FIX
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Safe colors (light theme during SSR)
  const colors = mounted ? themeColors : {
    background: '#ffffff',
    surface: '#f8fafc',
    text: { primary: '#0f172a', secondary: '#334155', accent: '#ffffff' },
    border: '#e2e8f0',
    primary: '#1d4ed8',
    secondary: '#1e40af',
  };
  const params = useParams();
const lang = (params?.lang as string) || 'en';


  const calculateGPA = () => {
    let totalCreditsSum = 0;
    let totalPointsSum = 0;

    courses.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      totalCreditsSum += course.credits;
      totalPointsSum += points * course.credits;
    });

    const calculatedGPA = totalCreditsSum > 0 ? totalPointsSum / totalCreditsSum : 0;
    
    setGpa(Number(calculatedGPA.toFixed(2)));
    setTotalCredits(totalCreditsSum);
    setTotalPoints(Number(totalPointsSum.toFixed(2)));
  };

  useState(() => {
    calculateGPA();
  });

  const addCourse = () => {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    setCourses([
      ...courses,
      { id: newId, name: `Course ${newId}`, credits: 3, grade: 'A' }
    ]);
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const getGPAStatus = (gpaValue: number) => {
    if (gpaValue >= 3.5) return { label: 'Excellent', color: colors.success };
    if (gpaValue >= 3.0) return { label: 'Good', color: colors.primary };
    if (gpaValue >= 2.0) return { label: 'Satisfactory', color: colors.warning };
    return { label: 'Needs Improvement', color: colors.error };
  };

  const gpaStatus = getGPAStatus(gpa);

  return (
    <ResponsiveToolWrapper>
      <div className="max-w-4xl mx-auto">
   
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">GPA Calculator</h1>
          <p className="text-text-secondary">Calculate your Grade Point Average (GPA) on a 4.0 scale</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-border" style={{ backgroundColor: colors.surface }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: colors.text.primary }}>
                  <GraduationCap className="h-5 w-5" style={{ color: colors.primary }} />
                  Courses
                </h2>
                <button
                  onClick={addCourse}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.text.accent
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Course
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {courses.map(course => (
                  <div 
                    key={course.id} 
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.border
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        className="flex-1 font-semibold bg-transparent border-b pb-1"
                        style={{ 
                          color: colors.text.primary,
                          borderColor: colors.border
                        }}
                        placeholder="Course Name"
                      />
                      <button
                        onClick={() => removeCourse(course.id)}
                        className="p-1 rounded hover:opacity-80"
                        style={{ color: colors.error }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs mb-1" style={{ color: colors.text.secondary }}>
                          Credits
                        </label>
                        <select
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                          className="w-full px-2 py-1 text-sm rounded border"
                          style={{ 
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.text.primary
                          }}
                        >
                          {[1, 2, 3, 4, 5].map(credit => (
                            <option key={credit} value={credit}>{credit} credit{credit !== 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs mb-1" style={{ color: colors.text.secondary }}>
                          Grade
                        </label>
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full px-2 py-1 text-sm rounded border"
                          style={{ 
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.text.primary
                          }}
                        >
                          {grades.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={calculateGPA}
                className="w-full mt-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.text.accent
                }}
              >
                <Calculator className="h-5 w-5" />
                Calculate GPA
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-border" style={{ backgroundColor: colors.surface }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>GPA Results</h2>
              
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2" style={{ color: gpaStatus.color }}>
                  {gpa.toFixed(2)}
                </div>
                <div className="text-lg font-semibold mb-1" style={{ color: gpaStatus.color }}>
                  {gpaStatus.label}
                </div>
                <div className="text-sm" style={{ color: colors.text.secondary }}>
                  4.0 Scale
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.text.secondary }}>Total Courses:</span>
                  <span className="font-semibold" style={{ color: colors.text.primary }}>{courses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.text.secondary }}>Total Credits:</span>
                  <span className="font-semibold" style={{ color: colors.text.primary }}>{totalCredits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.text.secondary }}>Total Points:</span>
                  <span className="font-semibold" style={{ color: colors.text.primary }}>{totalPoints}</span>
                </div>
              </div>
            </div>

            {/* Grade Scale Reference */}
            <div className="p-6 rounded-lg border border-border" style={{ backgroundColor: colors.surface }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>Grade Scale (4.0)</h2>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['A+ / A', '4.0'],
                  ['A-', '3.7'],
                  ['B+', '3.3'],
                  ['B', '3.0'],
                  ['B-', '2.7'],
                  ['C+', '2.3'],
                  ['C', '2.0'],
                  ['C-', '1.7'],
                  ['D+', '1.3'],
                  ['D', '1.0'],
                  ['D-', '0.7'],
                  ['F', '0.0'],
                ].map(([grade, points], index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-2 rounded"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.text.primary
                    }}
                  >
                    <span className="font-medium">{grade}</span>
                    <span>{points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GPA Tips */}
            <div 
              className="rounded-lg p-4"
              style={{ 
                backgroundColor: `${colors.primary}10`,
                border: `1px solid ${colors.primary}30`
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: colors.primary }}>GPA Tips</h3>
              <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: colors.primary }}>
                <li>GPA is calculated as (Grade Points × Credits) ÷ Total Credits</li>
                <li>A 4.0 GPA is considered perfect (straight A's)</li>
                <li>Most universities require a minimum 2.0 GPA</li>
                <li>Honors/AP courses may use weighted GPA scales</li>
              </ul>
            </div>
          </div>
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
        </div>
      </div>
    </ResponsiveToolWrapper>
  );

}

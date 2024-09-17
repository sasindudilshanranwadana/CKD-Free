import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.png';
import '../styles/Information.css';

const sections = [
  {
    title: "Kidney Function and Anatomy",
    content: `
The kidneys filter blood to remove waste products and excess fluids, which are excreted as urine. They also balance electrolytes, regulate blood pressure, and produce hormones (e.g., erythropoietin, which stimulates red blood cell production).

Each kidney contains approximately one million nephrons, the functional units that filter blood. The key structures include the renal cortex, renal medulla, renal pelvis, and the nephrons themselves, which consist of a glomerulus and a tubule.
    `
  },
  {
    title: "Causes and Risk Factors of CKD",
    content: `
Common Causes:
- Diabetes: High blood sugar levels can damage blood vessels in the kidneys.
- Hypertension: High blood pressure can damage the glomeruli, the filtering units of the kidneys.
- Glomerulonephritis: Inflammation of the glomeruli.   
- Polycystic Kidney Disease: A genetic disorder characterized by the growth of numerous cysts in the kidneys.
    
Risk Factors:
- Family History: Genetic predisposition to kidney disease.
- Age: CKD is more common in older adults.
- Obesity: Excess weight can lead to diabetes and hypertension.
- Smoking: Smoking can reduce blood flow to the kidneys and increase the risk of kidney damage.
- Certain Medications: Long-term use of NSAIDs and other nephrotoxic drugs.
    `
  },
  {
    title: "Symptoms and Complications of CKD",
    content: `
Often there are no symptoms in the early stages of CKD.
    
Advanced Symptoms:
- Fatigue: Due to anemia or buildup of waste products.
- Swelling (Edema): Particularly in the legs, ankles, and feet.
- Frequent Urination: Especially at night (nocturia).
- Foamy Urine: Indicative of proteinuria.
    
Complications:
- Anemia: Reduced production of erythropoietin.
- Bone Disease: Due to imbalances in calcium and phosphate metabolism (renal osteodystrophy).
- Cardiovascular Disease: Increased risk of heart disease and stroke.
- Electrolyte Imbalances: Including high potassium (hyperkalemia), which can be life-threatening.
    `
  },
  {
    title: "CKD Diagnosis",
    content: `
Blood Tests:
  Serum Creatinine: 
  - Used to estimate glomerular filtration rate (eGFR), an indicator of kidney function.
    
  Urine Tests:
  - Albumin-to-Creatinine Ratio (ACR): Measures the amount of protein (albumin) in the urine.
  - Dipstick Test: Quick test to detect protein, blood, and other substances in the urine.
    
  Imaging:
  - Ultrasound: To check for structural abnormalities.
  - CT Scan: Detailed imaging to detect kidney stones, tumors, or blockages.
    `
  },
  {
    title: "Management and Treatment of CKD",
    content: `
Lifestyle Changes:
- Diet: Low-sodium, low-protein, and low-phosphate diets.
- Exercise: Regular physical activity to maintain a healthy weight and control blood pressure.
- Smoking Cessation: Reducing further kidney damage and cardiovascular risk.
    
Medications:
- Antihypertensives: ACE inhibitors or ARBs to control blood pressure and reduce proteinuria.
- Diuretics: To reduce fluid retention.
- Erythropoiesis-Stimulating Agents (ESAs): To treat anemia.
    
Dialysis:
- Hemodialysis: Uses a machine to filter blood.
- Peritoneal Dialysis: Uses the lining of the abdomen to filter blood.
- Transplant: Kidney transplant as an option for end-stage renal disease (ESRD).
    `
  },
  {
    title: "Diet and Nutrition",
    content: `
Dietary Restrictions:
- Sodium: Limiting intake to reduce blood pressure and fluid retention.
- Potassium: Managing levels to prevent hyperkalemia.
- Phosphate: Controlling intake to prevent bone disease.
    
Protein Intake:
- Early Stages: Moderate protein intake to prevent excess waste buildup.
- Later Stages: Lower protein intake to reduce the kidneys' workload.
    
Fluid Management: Balancing fluid intake to prevent dehydration or fluid overload.
    
Specialized Diet Plans: Working with a dietitian to create personalized meal plans.
    `
  },
  {
    title: "Medications and Potential Risks",
    content: `
Harmful Medications:
- NSAIDs: Such as ibuprofen and naproxen, can damage kidneys with prolonged use.
- Herbal Supplements: Some may contain harmful substances.
    
Prescribed Medications:
- Blood Pressure Medications: ACE inhibitors, ARBs, and diuretics.
- Phosphate Binders: To control phosphate levels.
- ESAs: To manage anemia.
    `
  },
  {
    title: "Prevention and Early Detection",
    content: `
Regular Check-Ups: Monitoring kidney function, blood pressure, and blood sugar levels.
    
Screening: For high-risk groups, such as people with diabetes, hypertension, or a family history of CKD.
    `
  },
  {
    title: "Mental and Emotional Health",
    content: `
Impact of CKD: Chronic illness can lead to depression, anxiety, and stress.
    
Support Systems:
- Counseling and Therapy: Psychological support for mental health issues.
- Support Groups: Connecting with others who have CKD for shared experiences and encouragement.
    `
  },
  {
    title: "Patient Education and Self-Management",
    content: `
Knowledge Empowerment: Educating patients about CKD to promote proactive management.
    
Self-Monitoring: Encouraging patients to track their blood pressure, weight, and symptoms.
    
Health Literacy: Ensuring patients understand medical information and instructions.
    `
  },
  {
    title: "Impact of CKD on Daily Life",
    content: `
Quality of Life: Addressing fatigue, dietary restrictions, and activity limitations.
    
Social and Work Life: Adjusting routines and managing CKD while maintaining social and professional roles.
    
Physical Limitations: Adapting activities to accommodate changes in energy levels and physical capabilities.
    `
  },
  {
    title: "Genetics and Family History",
    content: `
Hereditary Factors: Understanding genetic predispositions to CKD.
    
Family Education: Raising awareness among family members about CKD risk factors and prevention strategies.
    `
  }
];

const Information = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sections.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sections.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + sections.length) % sections.length);
  };

  const setSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="information-container">
      <div className="header">
        <img src={backIcon} alt="Back" className="back-icon" onClick={() => navigate('/dashboard')} />
        <h1>Information</h1>
      </div>
      <div className="slideshow-container">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`mySlides fade ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="numbertext">{index + 1} / {sections.length}</div>
            <div className="text">
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
          </div>
        ))}
        <a className="prev" onClick={prevSlide}>&#10094;</a>
        <a className="next" onClick={nextSlide}>&#10095;</a>
        <div style={{ textAlign: 'center' }}>
          {sections.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Information;

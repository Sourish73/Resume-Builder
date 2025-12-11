import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import moment from 'moment';
import { dashboardStyles as styles } from '../assets/dummystyle';
import { FilePlus } from 'lucide-react'; // Changed from LucideFilePlus to FilePlus
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { ResumeSummaryCard } from '../components/cards';
import { CreateResumeForm } from '../components/CreateResumeForm';
import Modal from '../components/Modal';
import { LucideTrash2 } from 'lucide-react';


const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const calculateCompletion = (resume) => {
    // ... your existing calculateCompletion function ...
    return Math.round((completedFields / totalFields) * 100);
  };

 const fetchAllResumes = async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
    const payload = response?.data;

    // Normalise to an array safely
    let resumes = [];
    if (Array.isArray(payload)) {
      resumes = payload;
    } else if (Array.isArray(payload?.resumes)) {
      resumes = payload.resumes;
    } else if (Array.isArray(payload?.data)) {
      resumes = payload.data;
    } else if (Array.isArray(payload?.items)) {
      resumes = payload.items;
    } else {
      // fallback: try to extract any array value
      const arrValue = Object.values(payload || {}).find(v => Array.isArray(v));
      resumes = arrValue || [];
    }

    setAllResumes(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    toast.error('Failed to load resumes');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAllResumes();
  }, []);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    
    try {
      // Check your API_PATHS structure - it might be DELETE_BY_ID or something else
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
      toast.success('Resume deleted successfully');
      fetchAllResumes();
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error('Failed to delete resume');
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false); // Fixed function name
    }
  };

  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setShowDeleteConfirm(true);
  };

  return (
    <DashboardLayout activeMenu="dashboard">
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>My Resumes</h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length > 0 
                ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? 's' : ''}`
                : 'Start building your professional resume'
              }
            </p>
          </div>
          <div className='flex gap-4'>
            <button 
              className={styles.createButton}
              onClick={() => setOpenCreateModal(true)}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Create Now
                <FilePlus className="group-hover:translate-x-1 transition-transform" size={19} />
              </span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <FilePlus size={32} className="text-violet-600" />
            </div>
            <h3 className={styles.emptyTitle}>No resumes Yet</h3> 
            <p className={styles.emptyText}>
              You haven't created any resumes yet. Start building your professional resume to land your dream job.
            </p>
            <button className={styles.createButton} onClick={() => setOpenCreateModal(true)}>
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Create Your First Resume
                <FilePlus className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </button>
          </div>
        )}

        {/* Resumes Grid */}
        {!loading && allResumes.length > 0 && (
          <div className={styles.grid}>
            <div className={styles.newResumeCard} onClick={() => setOpenCreateModal(true)}>
              <div className={styles.newResumeIcon}>
                <FilePlus size={32} className="text-white" />
              </div>
              <h3 className={styles.newResumeTitle}>Create New Resume</h3>
              <p className={styles.newResumeText}>Start building your career</p>
            </div>
            
            {allResumes.map((resume) => (
              <ResumeSummaryCard 
                key={resume._id} 
                imageUrl={resume.thumbnailLink}
                title={resume.title} 
                createdAt={resume.createdAt}  
                updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
                isPremium={resume.isPremium} // Fixed spelling: isPremium not isPremimum
                isNew={moment().diff(moment(resume.createdAt), 'days') < 7} 
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen = {openCreateModal} onClose ={()=> setOpenCreateModal(false)}
      hideHeader maxWidth ='max-w-2xl'>
        <div className = 'p-6'>
          <div className= {styles.modalHeader}>
            <h3 className= {styles.modalTitle}>Create New Resume</h3>
            <button onClick= {()=> setOpenCreateModal(false)} className= {styles.modalCloseButton}>
              X
            </button>
          </div>
          <CreateResumeForm onSuccess={()=>{
            setOpenCreateModal(false);
            fetchAllResumes();
          }} />

        
        </div>
      </Modal>

      <Modal isOpen={showDeleteConfirm} onClose ={() => setShowDeleteConfirm(false)} title = 'Confirm Deletion'
      showActionBtn actionBtnText= 'Delete' actionBtnClassname = 'bg-red-600 hover:bg-red-700'
      onActionClick={handleDeleteResume}>
        <div className = 'p-4'>
          <div className = 'flex flex-col items-center text-center'>
            <div className = {styles.deleteIconWrapper}>
            <LucideTrash2 className='text-orange-600 ' size = {24} />
          </div>
          <h3 className= {styles.deleteTitle}>Delete Resume?</h3>
          <p className ={styles.deleteText}>
          Are you sure  you want to delete this resume?This action cannot be undone.
         </p>
       </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../common/useAuth'
import { message, Button } from 'antd';
import Pageloading from '../../../common/loading/Pageloading';
import Main from "../Layout"
import AppTable from "../../../common/AppTable"
import TermsModal from './TermsModal';
import { useNavigate } from 'react-router-dom';
import GoBack from '../../../common/Goback';
const TandCClient = () => {
  const { token, apiurl } = useAuth()
  const [termsData, setTermsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedTerms, setSelectedTerms] = useState([]);
  const [open, setOpen] = useState(false);


  const handleViewTerms = (terms) => {
    setSelectedTerms(terms || []);
    setOpen(true);
  };



  const fetchJobTerms = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiurl}/client/jobpost/terms/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job post terms');
      }

      const data = await response.json();
      setTermsData(data.data || [])
    } catch (err) {
      message(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobTerms()
  }, [])

  const columns = [
    {
      accessorKey: "job_title",
      header: "Job Title",
      width: 250,
      searchField: true,
      cell: ({ row }) => (
        <div
          onClick={() => navigate(`/agency/postings/${row.original.job_id}`)}
          style={{ fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
        >
          {row.getValue("job_title")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      width: 180,
    },
    {
      accessorKey: "organization",
      header: "Recruiting Partner",
      width: 250,
    },
    {
      accessorKey: "view_terms",
      header: "View Terms",
      width: 150,
      cell: ({ row }) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewTerms(row.original.terms)}
        >
          View Terms
        </Button>
      ),
    },
  ];



  return (
    <Main defaultSelectedKey="7" defaultSelectedChildKey='7-1'>
      {loading ?
        <Pageloading /> :<>
        <div className='mt-4 -ml-4'>
          <GoBack />
        </div>
        <AppTable data={termsData} columns={columns} rowKey="term_id" />
      </>
      }

      {selectedTerms &&

        <TermsModal open={open} onClose={() => setOpen(false)} terms={selectedTerms} />
      }
    </Main>
  )
}

export default TandCClient






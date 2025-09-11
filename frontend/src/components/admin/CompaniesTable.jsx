import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies = [], searchCompanyByText = "" } = useSelector(
    (store) => store.company
  );
  const navigate = useNavigate();

  const filteredCompanies = useMemo(() => {
    const q = searchCompanyByText.trim().toLowerCase();
    if (!q) return Array.isArray(companies) ? companies : [];
    return (companies || []).filter((c) =>
      (c?.name || "").toLowerCase().includes(q)
    );
  }, [companies, searchCompanyByText]);

  return (
    <div className="overflow-hidden rounded-sm border bg-white ring-1 ring-gray-100">
      {/* makes sticky header useful on long lists */}
      <div className="max-h-[60vh] overflow-auto">
        <Table>
          <TableCaption className="text-gray-500 pb-8">
            A list of your recent registered companies
          </TableCaption>

          <TableHeader className="bg-gray-50/70 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[64px]">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="text-right w-[90px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCompanies.length ? (
              filteredCompanies.map((company, idx) => {
                const key =
                  company?._id ||
                  company?.id ||
                  `${company?.name || "company"}-${company?.createdAt || idx}`;

                const displayDate = company?.createdAt
                  ? new Date(company.createdAt).toLocaleDateString()
                  : "—";

                const initials =
                  (company?.name || "?")
                    .trim()
                    .split(/\s+/)
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "?";

                return (
                  <TableRow
                    key={key}
                    className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-gray-50/30"
                  >
                    <TableCell className="py-3">
                      <Avatar className="h-9 w-9 ring-1 ring-gray-200">
                        <AvatarImage
                          src={company?.logo}
                          alt={company?.name ? `${company.name} logo` : "Company logo"}
                        />
                        <AvatarFallback className="text-[10px]">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell
                      className="font-medium max-w-[280px] truncate"
                      title={company?.name || ""}
                    >
                      {company?.name || "—"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-gray-600">
                      {displayDate}
                    </TableCell>

                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-sm p-1.5 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label="Open actions"
                            title="Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          sideOffset={6}
                          className="w-36 p-2 rounded-lg shadow-md"
                        >
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/companies/${company?._id}`)}
                            className="flex items-center gap-2 w-full text-left rounded-sm px-2 py-1.5 hover:bg-gray-50"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-10">
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompaniesTable;

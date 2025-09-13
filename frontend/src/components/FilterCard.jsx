// src/components/FilterCard.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
import { SlidersHorizontal } from "lucide-react";

const FILTER_DATA = [
  { type: "Location", options: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"] },
  { type: "Industry", options: ["Frontend Developer", "Backend Developer", "FullStack Developer"] },
  { type: "Salary", options: ["0-40k", "42-1lakh", "1lakh to 5lakh"] },
];

function buildQuery({ location, industry, salary }) {
  return [location, industry, salary].filter(Boolean).join(" ");
}

export default function FilterCard() {
  const dispatch = useDispatch();

  // separate state per group (so selections don’t overwrite each other)
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [salary, setSalary] = useState("");

  const selection = useMemo(() => ({ location, industry, salary }), [location, industry, salary]);
  const activeCount = useMemo(
    () => Object.values(selection).filter(Boolean).length,
    [selection]
  );

  const applyFilters = useCallback(() => {
    const query = buildQuery(selection);
    dispatch(setSearchedQuery(query));
  }, [dispatch, selection]);

  const clearAll = useCallback(() => {
    setLocation("");
    setIndustry("");
    setSalary("");
    dispatch(setSearchedQuery("")); // optional: clear search
  }, [dispatch]);

  // --- Panel body (shared by mobile sheet & desktop card) ---
  const PanelContent = (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={["Location", "Industry", "Salary"]}>
        {/* Location */}
        <AccordionItem value="Location" className="border-border">
          <AccordionTrigger className="text-sm font-semibold">Location</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={location} onValueChange={setLocation} className="mt-2 space-y-2">
              {FILTER_DATA[0].options.map((opt, idx) => {
                const id = `loc-${idx}`;
                return (
                  <div key={id} className="flex items-center gap-2">
                    <RadioGroupItem id={id} value={opt} />
                    <Label htmlFor={id} className="cursor-pointer">{opt}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Industry */}
        <AccordionItem value="Industry" className="border-border">
          <AccordionTrigger className="text-sm font-semibold">Industry</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={industry} onValueChange={setIndustry} className="mt-2 space-y-2">
              {FILTER_DATA[1].options.map((opt, idx) => {
                const id = `ind-${idx}`;
                return (
                  <div key={id} className="flex items-center gap-2">
                    <RadioGroupItem id={id} value={opt} />
                    <Label htmlFor={id} className="cursor-pointer">{opt}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Salary */}
        <AccordionItem value="Salary" className="border-border">
          <AccordionTrigger className="text-sm font-semibold">Salary</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={salary} onValueChange={setSalary} className="mt-2 space-y-2">
              {FILTER_DATA[2].options.map((opt, idx) => {
                const id = `sal-${idx}`;
                return (
                  <div key={id} className="flex items-center gap-2">
                    <RadioGroupItem id={id} value={opt} />
                    <Label htmlFor={id} className="cursor-pointer">{opt}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // --- Mobile (Sheet) ---
  const MobileFilters = (
    <div className="md:hidden">
      <div className="flex items-center justify-between mb-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters {activeCount > 0 && <Badge variant="secondary" className="ml-1">{activeCount}</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filter Jobs
                {activeCount > 0 && <Badge variant="secondary" className="ml-1">{activeCount}</Badge>}
              </SheetTitle>
            </SheetHeader>

            <Separator className="my-3" />

            <ScrollArea className="px-4 pb-24 h-[calc(85vh-6rem)]">
              {PanelContent}
            </ScrollArea>

            {/* Sticky footer actions */}
            <SheetFooter className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex items-center gap-2">
              <Button variant="outline" className="w-1/3" onClick={clearAll}>
                Clear
              </Button>
              <Button className="w-2/3" onClick={applyFilters}>
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Quick applied badges (optional preview) */}
        <div className="flex flex-wrap gap-2">
          {location && <Badge variant="outline">{location}</Badge>}
          {industry && <Badge variant="outline">{industry}</Badge>}
          {salary && <Badge variant="outline">{salary}</Badge>}
        </div>
      </div>
    </div>
  );

  // --- Desktop (Sidebar Card) ---
  const DesktopSidebar = (
    <aside className="hidden md:block w-full">
      <div className="bg-background p-4 rounded-lg border ring-1 ring-border/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-base">Filter Jobs</h2>
          <div className="flex items-center gap-2">
            {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
            <Button variant="ghost" size="sm" onClick={clearAll}>Clear</Button>
          </div>
        </div>

        <Separator className="mb-4" />
        <div className="space-y-4">
          {PanelContent}
        </div>

        <div className="mt-4">
          <Button className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <section className="w-full">
      {MobileFilters}
      {DesktopSidebar}
    </section>
  );
}

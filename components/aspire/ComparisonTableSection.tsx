import { Section } from "./ui/Section";
import { FadeInSection } from "./ui/FadeInSection";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export function ComparisonTableSection() {
  const features = [
    { name: "In-Person\nTruganina Lessons", aspire: true, others: false },
    { name: "Flat Monthly Pricing", aspire: true, others: false },
    {
      name: "Trial Class Before\nCommitting",
      aspire: true,
      others: false,
    },
    {
      name: "Progress Tracking &\nFeedback",
      aspire: true,
      others: false,
    },
    { name: "In-Person\nTruganina Lessons", aspire: true, others: "???" },
    { name: "In-Person\nTruganina Lessons", aspire: true, others: false },
  ];

  return (
    <Section variant="medium-blue" className="py-12">
      <div className="space-y-8 text-center max-w-4xl mx-auto">
        <FadeInSection>
          <div className="mb-[-20px] relative z-10 w-fit mx-auto">
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white">
              The Aspire Difference
            </h2>
            <Image
              src={"/marketing/decorative-line.svg"}
              alt="decorative-line"
              width={120}
              height={20}
              className="mt-[-5px] ml-[130px] lg:ml-[200px]"
            />
          </div>
        </FadeInSection>

        {/* Hero Image with Gradient */}
        <FadeInSection delay={0.1}>
          <div className="relative z-0 h-[400px] w-full overflow-hidden rounded-[10px] ">
            {/* Placeholder for image */}
            <div className="absolute inset-0 bg-gray-600">
              <Image
                src={"/marketing/comparison/photo-4.png"}
                alt="Image"
                fill
                className="object-cover w-full h-full"
              />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-aspire-medium-blue via-aspire-medium-blue/40 to-transparent h-[200px]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-aspire-medium-blue via-aspire-medium-blue/40 to-transparent h-[300px]" />

            <h3 className="absolute bottom-15 w-full text-center text-2xl lg:text-3xl font-extrabold text-white">
              What Makes Aspire Different
            </h3>
          </div>
        </FadeInSection>

        {/* Title & Table Container */}
        <FadeInSection delay={0.2}>
          <div className="mx-auto space-y-6 mt-[-80px] relative z-10 ">
            {/* Comparison Table (shadcn `Table` component) */}
            <div className="mx-auto w-[calc(100%-1rem)] overflow-hidden rounded-lg bg-white shadow border-2 border-aspire-medium-blue">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-aspire-medium-blue">
                    <TableHead className="w-[50%] p-4 text-aspire-text-dark font-extrabold">
                      Feature
                    </TableHead>
                    <TableHead className="w-[25%] p-4 text-center text-aspire-text-dark font-extrabold border-l-1 border-aspire-medium-blue">
                      Aspire
                      <br />
                      Academics
                    </TableHead>
                    <TableHead className="w-[25%] p-4 text-center text-aspire-text-dark font-extrabold border-l-1 border-aspire-medium-blue">
                      Other
                      <br />
                      Tutoring Options
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature, index) => (
                    <TableRow
                      key={index}
                      className={
                        index !== features.length - 1
                          ? "border-b border-aspire-medium-blue"
                          : ""
                      }
                    >
                      <TableCell className="p-4 text-left text-sm font-semibold text-aspire-text-dark align-middle">
                        <span className="whitespace-pre-line leading-tight">
                          {feature.name}
                        </span>
                      </TableCell>

                      <TableCell className="p-4 text-center border-l-1 border-aspire-medium-blue align-middle">
                        <div className="flex items-center justify-center">
                          <span className="text-2xl">✅</span>
                        </div>
                      </TableCell>

                      <TableCell className="p-4 text-center align-middle border-l-1 border-aspire-medium-blue">
                        {feature.others === false ? (
                          <div className="flex items-center justify-center">
                            <span className="text-2xl">❌</span>
                          </div>
                        ) : (
                          <span className="text-xl font-semibold text-aspire-text-dark">
                            {String(feature.others)}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
}

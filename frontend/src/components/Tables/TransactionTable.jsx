import moment from "moment";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { openModal as deleteModal } from "../../features/TransactionModals/deleteModal";
import { openModal as viewAndUpdateModal } from "../../features/TransactionModals/viewAndUpdateModal";
import { EyeOutline as Eye, Edit, Delete } from "../../utils/Icons";
import PropTypes from "prop-types";

const TransactionTable = ({
  data,
  name,
  isLoading,
  setCurrentPage,
  totalPages,
  currentPage,
  chipColorMap,
}) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full flex justify-center animate-fade-in">
      <div className="w-full max-w-5xl bg-white/80 dark:bg-background/80 rounded-3xl shadow-xl p-4 md:p-8 overflow-x-auto">
        <Table
          aria-label="Transactions table"
          bottomContent={
            totalPages > 1 ? (
              <div className="flex w-full justify-center mt-4">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={currentPage}
                  total={totalPages}
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            ) : null
          }
          classNames={{
            base: "pb-12",
            wrapper: "h-full",
            table: !data ? "h-full" : "",
          }}
        >
          <TableHeader>
            <TableColumn key={name} className="capitalize text-lg text-primary font-bold">
              {name}
            </TableColumn>
            <TableColumn key="amount" className="text-lg font-semibold">Amount</TableColumn>
            <TableColumn key="category" className="text-lg font-semibold">Category</TableColumn>
            <TableColumn key="description" className="text-lg font-semibold">Description</TableColumn>
            <TableColumn key="date" className="text-lg font-semibold">Date</TableColumn>
            <TableColumn key="actions" className="text-lg font-semibold">Actions</TableColumn>
          </TableHeader>
          <TableBody
            items={data || []}
            loadingContent={<Spinner color="primary" size="lg" />}
            loadingState={isLoading ? "loading" : "idle"}
            emptyContent={
              !data && !isLoading
                ? `No ${name}s to display. Please add some ${name}s!`
                : ""
            }
          >
            {data?.map(({ title, amount, category, description, date, _id }) => (
              <TableRow key={_id} className="hover:bg-primary/10 transition-all group">
                <TableCell className="text-primary font-calSans tracking-wider capitalize text-base group-hover:font-bold">
                  {title}
                </TableCell>
                <TableCell className="text-base font-semibold text-emerald-600">₹{amount}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize text-base font-medium px-3 py-1"
                    color={chipColorMap[category]}
                    size="md"
                    variant="flat"
                  >
                    {category}
                  </Chip>
                </TableCell>
                <TableCell
                  className={`transition-all text-base ${
                    description.length > 20
                      ? " hover:text-gray-400 hover:cursor-pointer"
                      : ""
                  }`}
                  onClick={() => {
                    if (description.length > 20) {
                      dispatch(
                        viewAndUpdateModal({
                          transaction: {
                            title,
                            amount,
                            category,
                            description,
                            date,
                          },
                          _id,
                          type: name,
                          isDisabled: true,
                        })
                      );
                    }
                  }}
                >
                  {description.length > 20
                    ? `${description.slice(0, 20)}...`
                    : description}
                </TableCell>
                <TableCell className="text-base text-gray-600">
                  {moment(date).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell className="relative flex items-center gap-2">
                  <Tooltip content="View More">
                    <span
                      className="text-xl text-primary cursor-pointer active:opacity-50 hover:scale-110 transition-transform"
                      onClick={() =>
                        dispatch(
                          viewAndUpdateModal({
                            transaction: {
                              title,
                              amount,
                              category,
                              description,
                              date,
                            },
                            _id,
                            type: name,
                            isDisabled: true,
                          })
                        )
                      }
                    >
                      <Eye />
                    </span>
                  </Tooltip>
                  <Tooltip content="Edit">
                    <span
                      className="text-xl text-secondary cursor-pointer active:opacity-50 hover:scale-110 transition-transform"
                      onClick={() =>
                        dispatch(
                          viewAndUpdateModal({
                            transaction: {
                              _id,
                              title,
                              amount,
                              category,
                              description,
                              date,
                            },
                            _id,
                            type: name,
                          })
                        )
                      }
                    >
                      <Edit />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete">
                    <span
                      className="text-xl text-danger cursor-pointer active:opacity-50 hover:scale-110 transition-transform"
                      onClick={() =>
                        dispatch(deleteModal({ title, _id, type: name }))
                      }
                    >
                      <Delete />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

TransactionTable.propTypes = {
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  setCurrentPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  chipColorMap: PropTypes.object,
};

export default TransactionTable;

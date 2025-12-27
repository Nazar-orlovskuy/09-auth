import styles from './Pagination.module.css';
import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
  pageCount={pageCount}
  forcePage={currentPage - 1}
  previousLabel="<"
  nextLabel=">"
  onPageChange={(e) => onPageChange(e.selected + 1)}
  containerClassName={styles.pagination}       // контейнер пагінації
  pageClassName={styles.page}                  // кожна сторінка
  pageLinkClassName={styles.pageLink}          // лінк сторінки
  previousClassName={styles.previous}          // кнопка попередньої
  nextClassName={styles.next}                  // кнопка наступної
  activeClassName={styles.active}             // активна сторінка
  disabledClassName={styles.disabled}         // відключена кнопка
/>
  );
}

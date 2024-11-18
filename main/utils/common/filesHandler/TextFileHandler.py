import os

destination_path = r'testData/uploads'
comparison_path = r'testData/comparison/'

class TextFileHandler:
    @staticmethod
    def compare_txt_files(file_path1, file_path2):
        comparison = os.path.join(comparison_path, 'compare_txt_files.csv')
        # Open both files in read mode
        with open(file_path1, 'r') as f1, open(file_path2, 'r') as f2:
            # Read the headers of the files
            file1_headers = f1.readline()
            file2_headers = f2.readline()

            # Read the content of both files
            file1_contents = f1.read()
            file2_contents = f2.read()

        # Split the content into lines
        file1_lines = file1_contents.splitlines()
        file2_lines = file2_contents.splitlines()

        # Compare the lines of both files
        diff = []
        for line_no, (line1, line2) in enumerate(zip(file1_lines, file2_lines), start=1):
            if line1 != line2:
                diff.append([line_no, line1, line2])

        if len(diff) != 0:
            print('Text files have differences')
            with open(comparison, 'w') as diffFile:
                diffFile.write(file1_headers)
                diffFile.write(file2_headers)
                # Iterate over each line
                for line_no, line1, line2 in diff:
                    diffFile.write(f'Line: {line_no}\n')
                    diffFile.write(f'{line1}\n')
                    diffFile.write(f'{line2}\n')
                    diffFile.write('-' * 20 + '\n')

        print('Comparison completed successfully')
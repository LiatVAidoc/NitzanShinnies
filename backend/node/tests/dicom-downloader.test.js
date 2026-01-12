import { jest } from '@jest/globals';

const mockS3Send = jest.fn();
const mockGetObjectCommand = jest.fn();
const mockParseDicom = jest.fn();

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: mockS3Send
  })),
  GetObjectCommand: mockGetObjectCommand
}), { virtual: true });

jest.mock('dicom-parser', () => ({
  parseDicom: mockParseDicom
}), { virtual: true });

import { downloadDicomFile, parseDicomFile } from '../dicom-downloader.js';

describe('DICOM Downloader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockS3Send.mockResolvedValue({
      Body: {
        transformToByteArray: async () => Buffer.from('mock-dicom-data')
      }
    });
    
    mockParseDicom.mockReturnValue({
      string: jest.fn().mockImplementation((tag) => {
        const tags = {
          'x00100020': 'TEST-PATIENT-ID',
          'x00080020': '20230101',
          'x00080060': 'CT',
          'x00080080': 'TEST-INSTITUTION',
          'x00081030': 'TEST-STUDY'
        };
        return tags[tag] || '';
      })
    });
  });

  test('downloadDicomFile should throw not implemented error', async () => {
    await expect(downloadDicomFile('test-bucket/test-path.dcm')).rejects.toThrow('Not implemented');
  });

  test('parseDicomFile should throw not implemented error', () => {
    expect(() => parseDicomFile(Buffer.from('test'))).toThrow('Not implemented');
  });
}); 
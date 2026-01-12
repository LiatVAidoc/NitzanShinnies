import pytest
from playwright.sync_api import Page, expect

@pytest.fixture(scope="session")
def base_url():
    return "http://localhost:3000"

def test_homepage_title(page: Page, base_url):
    page.goto(base_url)
    expect(page).to_have_title("DICOM Metadata Viewer")

def test_dicom_error_handling(page: Page, base_url):
    page.goto(base_url)
    
    # Input path
    page.fill('input[placeholder="e.g., my-bucket/path/to/image.dcm"]', "test-bucket/test-file.dcm")
    
    # Click Load
    page.click('text=Load')
    
    # Verify Error Alert
    # We expect "S3 Error: An error occurred (403) when calling the HeadObject operation: Forbidden"
    error_alert = page.locator('.MuiAlert-message')
    expect(error_alert).to_be_visible(timeout=5000)
    expect(error_alert).to_contain_text("S3 Error")
    expect(error_alert).to_contain_text("Forbidden")

def test_initial_ui_state(page: Page, base_url):
    page.goto(base_url)
    
    # Check Header
    expect(page.locator('h1')).to_have_text("DICOM Metadata Viewer")
    
    # Check Button Disabled State (Initially Empty)
    load_button = page.locator('button', has_text="Load")
    expect(load_button).to_be_disabled()

def test_persistent_table_placeholder(page: Page, base_url):
    page.goto(base_url)
    
    # Verify placeholder text exists when no data is loaded
    placeholder = page.locator('text=No metadata loaded. Please enter a path and click Load.')
    expect(placeholder).to_be_visible()

def test_custom_fields_loading(page: Page, base_url):
    page.goto(base_url)
    
    # Open Settings
    # Use robust selector via aria-label
    page.click('button[aria-label="Load Configuration"]')
    
    # Check Dialog
    expect(page.locator('text=Load Configuration')).to_be_visible()
    
    # Toggle off "Load all fields"
    page.click('input[type="checkbox"]') # Switch
    
    # Enter fields
    page.fill('textarea', 'PatientID')
    
    # Close
    page.click('text=Close')
    
    # Now verify the text changed (Loading Mode: Custom Fields)
    expect(page.locator('text=Custom Fields')).to_be_visible()


